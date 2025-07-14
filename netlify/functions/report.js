exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const resp = await fetch(process.env.DISCORD_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': event.headers['content-type']
    },
    body: event.body
  });

  return {
    statusCode: resp.status,
    body:       await resp.text()
  };
};
