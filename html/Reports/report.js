// netlify/functions/report.js
exports.handler = async function(event) {
  // 1. Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 2. Read your webhook URL from env
  const url = process.env.DISCORD_WEBHOOK;

  // 3. Forward the incoming request body straight to Discord
  const resp = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    event.body
  });

  // 4. Return Discord’s response status/text back to the client
  return {
    statusCode: resp.status,
    body:       await resp.text()
  };
};
