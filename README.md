# CROSSWIRE

Direct peer-to-peer file transfer over WebRTC data channels — no upload server, no size cap, no account. Files stream straight from one browser to the other. The only thing that touches a server is a short-lived TURN credential for peers stuck behind NAT.

## How it works

- **Transport:** WebRTC `RTCDataChannel`. Bytes go peer-to-peer; nothing is stored anywhere.
- **Signaling:** manual — you copy the connection blob between the two browsers yourself (WhatsApp, Slack, email, whatever). No signaling server.
- **NAT traversal:** Cloudflare TURN. Credentials are minted on demand by a Pages Function (`functions/turn.js`) so the secret never reaches the browser.
- **Backpressure:** sends pause on `bufferedAmountLow` so large files don't blow up the data channel buffer.

## Run locally

```bash
npm install
npm start        # npx serve public → http://localhost:3000
```

It's a static site — `public/index.html` is the whole app. TURN won't work locally without the Pages Function env vars (see below), but same-network transfers over STUN will.

## Connecting two peers

Both sides open the app. Then:

1. **Tab A:** hit **Create offer**, copy Station A's box.
2. **Tab B:** paste it into Station B, hit **Connect**.
3. **Tab B:** copy the reply from its Station A box.
4. **Tab A:** paste the reply into Station B, hit **Connect**.

Status flips to connected. Now either side can pick a file and send it — transfer is bi-directional.

## Deploy

Hosted on Cloudflare Pages (project `crosswire360`):

```bash
npm run deploy
```

For TURN, set these env vars on the Pages project (Cloudflare dashboard → **Realtime → TURN** to create the key):

- `TURN_KEY_ID`
- `TURN_KEY_TOKEN`

## License

See [LICENCE.md](LICENCE.md).
