export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const data = req.body ? JSON.parse(req.body) : {};
    console.log(`[VISIT] ${data.page || 'unknown'} at ${new Date().toISOString()}`);
  } catch(e) {}
  res.status(200).json({ok:true});
}
