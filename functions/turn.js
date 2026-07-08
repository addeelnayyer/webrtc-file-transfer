// Mints short-lived Cloudflare TURN credentials so the secret never reaches the
// browser. Set TURN_KEY_ID and TURN_KEY_TOKEN in the Pages project env vars.
// Create the key at: Cloudflare dashboard → Realtime → TURN.
export async function onRequest(context) {
  const { TURN_KEY_ID, TURN_KEY_TOKEN } = context.env;
  if (!TURN_KEY_ID || !TURN_KEY_TOKEN) {
    return new Response("TURN not configured", { status: 500 });
  }
  const r = await fetch(
    `https://rtc.live.cloudflare.com/v1/turn/keys/${TURN_KEY_ID}/credentials/generate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TURN_KEY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl: 86400 }),
    }
  );
  // Response shape: { iceServers: { urls: [...], username, credential } }
  return new Response(r.body, {
    status: r.status,
    headers: { "content-type": "application/json" },
  });
}
