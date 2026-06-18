export interface Env {
  DASHSCOPE_API_KEY?: string
  BAZI_KV?: KVNamespace
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleAiPost(request: Request, env: Env): Promise<Response> {
  let body: { prompt?: string; apiKey?: string; stream?: boolean; model?: string }
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const { prompt, stream } = body
  if (!prompt || typeof prompt !== 'string') {
    return jsonResponse({ error: 'Missing or invalid "prompt" in request body' }, 400)
  }

  const apiKey = body.apiKey || env.DASHSCOPE_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: 'No API key provided. Set DASHSCOPE_API_KEY in env or pass apiKey in body' }, 400)
  }

  const model = body.model || 'qwen-max'
  const useStream = stream !== false // default to streaming

  const dashScopePayload = {
    model,
    messages: [
      { role: 'user', content: prompt },
    ],
    stream: useStream,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), useStream ? 120_000 : 60_000)

  try {
    const upstream = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashScopePayload),
        signal: controller.signal,
      },
    )

    if (!upstream.ok) {
      const errorText = await upstream.text()
      return jsonResponse({ error: `Upstream API error ${upstream.status}: ${errorText}` }, upstream.status)
    }

    if (useStream) {
      // Pipe the streaming response back to the client
      const { readable, writable } = new TransformStream()
      upstream.body!.pipeTo(writable).catch(() => {})

      return new Response(readable, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Non-streaming: return the full JSON response
    const result = await upstream.json()
    return jsonResponse(result)
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return jsonResponse({ error: 'Request timed out' }, 504)
    }
    const message = err instanceof Error ? err.message : String(err)
    return jsonResponse({ error: `Fetch failed: ${message}` }, 502)
  } finally {
    clearTimeout(timeout)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (url.pathname === '/api/health') {
      return jsonResponse({ status: 'ok', ts: Date.now() })
    }

    if (url.pathname === '/api/ai' && request.method === 'POST') {
      return handleAiPost(request, env)
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders })
  },
}

