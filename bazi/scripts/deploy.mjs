/**
 * 八字排盘 · Cloudflare Pages 自动部署脚本
 *
 * 用法：
 *   1. 在 Cloudflare Dashboard 创建 API Token (Pages: Edit 权限)
 *   2. CLOUDFLARE_API_TOKEN=xxx node scripts/deploy.mjs
 *
 * 环境变量：
 *   CLOUDFLARE_API_TOKEN  - 必填，Cloudflare API Token
 *   CLOUDFLARE_ACCOUNT_ID - 可选，自动获取
 *   PROJECT_NAME          - 可选，默认 bazi-eight-characters
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { createHash } from 'crypto';

const API_BASE = 'https://api.cloudflare.com/client/v4';
const PROJECT_NAME = process.env.PROJECT_NAME || 'bazi-eight-characters';
const DIST_DIR = join(process.cwd(), 'dist');

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) {
  console.error('❌ 请设置 CLOUDFLARE_API_TOKEN 环境变量');
  console.error('   创建方式: https://dash.cloudflare.com/profile/api-tokens');
  console.error('   权限要求: Account > Cloudflare Pages > Edit');
  process.exit(1);
}

async function cfApi(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await resp.json();
  if (!data.success) {
    throw new Error(`API error ${resp.status}: ${JSON.stringify(data.errors)}`);
  }
  return data.result;
}

async function getAccountId() {
  const accounts = await cfApi('/accounts');
  if (!accounts || accounts.length === 0) {
    throw new Error('No Cloudflare accounts found');
  }
  console.log(`  账号: ${accounts[0].name} (${accounts[0].id})`);
  return accounts[0].id;
}

function collectFiles(dir) {
  const files = [];
  function walk(d) {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      const rel = full.replace(DIST_DIR + '/', '');
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else {
        const content = readFileSync(full);
        const hash = createHash('sha256').update(content).digest('hex');
        const mimeType = extname(full) === '.js' ? 'application/javascript'
          : extname(full) === '.css' ? 'text/css'
          : extname(full) === '.html' ? 'text/html'
          : extname(full) === '.svg' ? 'image/svg+xml'
          : extname(full) === '.png' ? 'image/png'
          : extname(full) === '.jpg' || extname(full) === '.jpeg' ? 'image/jpeg'
          : extname(full) === '.woff2' ? 'font/woff2'
          : extname(full) === '.json' ? 'application/json'
          : 'application/octet-stream';
        files.push({ path: rel, content, hash, mimeType });
      }
    }
  }
  walk(dir);
  return files;
}

async function createOrGetProject(accountId) {
  // Try to get existing project
  try {
    const project = await cfApi(`/accounts/${accountId}/pages/projects/${PROJECT_NAME}`);
    console.log(`  项目已存在: ${PROJECT_NAME}`);
    return project;
  } catch (e) {
    // Project doesn't exist, create it
    console.log(`  创建新项目: ${PROJECT_NAME}`);
    return await cfApi(`/accounts/${accountId}/pages/projects`, {
      method: 'POST',
      body: JSON.stringify({
        name: PROJECT_NAME,
        production_branch: 'main',
      }),
    });
  }
}

async function deploy(accountId, files) {
  console.log(`  上传 ${files.length} 个文件...`);

  // Build manifest
  const manifest = {};
  for (const f of files) {
    manifest[f.path] = f.hash;
  }

  // Start deployment
  const deployment = await cfApi(`/accounts/${accountId}/pages/projects/${PROJECT_NAME}/deployments`, {
    method: 'POST',
    body: JSON.stringify({ manifest }),
  });

  // Upload files
  const uploadUrls = deployment?.stages?.[0]?.urls || {};
  for (const f of files) {
    const url = uploadUrls[f.path];
    if (url) {
      const uploadResp = await fetch(url, {
        method: 'PUT',
        body: f.content,
        headers: { 'Content-Type': f.mimeType },
      });
      if (!uploadResp.ok) {
        console.error(`  ⚠ 上传失败: ${f.path} (${uploadResp.status})`);
      } else {
        console.log(`  ✓ ${f.path}`);
      }
    } else {
      console.log(`  - ${f.path} (未变更)`);
    }
  }

  return deployment;
}

async function main() {
  console.log('八字排盘 · Cloudflare Pages 部署\n');

  // 1. Get account
  console.log('📋 步骤 1/3: 获取 Cloudflare 账号信息');
  const accountId = await getAccountId();

  // 2. Collect files
  console.log('\n📋 步骤 2/3: 收集构建产物');
  const files = collectFiles(DIST_DIR);
  console.log(`  找到 ${files.length} 个文件:`);
  for (const f of files) {
    console.log(`  - ${f.path} (${(f.content.length / 1024).toFixed(1)} KB)`);
  }

  // 3. Create project & deploy
  console.log('\n📋 步骤 3/3: 创建/更新 Pages 项目并部署');
  await createOrGetProject(accountId);
  const result = await deploy(accountId, files);

  const deploymentUrl = result?.url || result?.subdomain
    ? `https://${result.subdomain}`
    : `https://${PROJECT_NAME}.pages.dev`;
  console.log(`\n✅ 部署完成!`);
  console.log(`   访问地址: ${deploymentUrl}`);
  console.log(`   部署 ID: ${result?.id || 'N/A'}`);
}

main().catch(err => {
  console.error(`\n❌ 部署失败: ${err.message}`);
  process.exit(1);
});

