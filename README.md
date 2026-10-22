# evoke_sidequest

Evoke Sidequest turns the quests you finish in your favourite games into collectible character cards you own, minted on Ethereum Sepolia.

- **Cards:** six tiers (Bronze → Silver → Gold → Platinum → Diamond → Ultra Legendary). Harder tasks earn higher tiers. Minted card images are generated in code.
- **Games:** Valorant, League of Legends, Fortnite, Dota 2 and CS2: 50 character cards, each with official art (loaded from the publishers' asset servers), a tier, an overall rating and six skill stats.
- **Contract:** the existing `ArtGallery` ERC-721 at `0xCDc6E9B074F2422f2BD1EdfCC9C9813ac0E52f57` on Sepolia (unchanged). Card details are stored in the token description as `EVOKE1:{json}`.

## Run locally

```
npm install            # repo root: upload server + Hardhat
node server.js         # IPFS upload server on :5000 (needs PINATA_API_KEY / PINATA_SECRET_KEY in .env)

cd frontend
npm install
npm run dev            # site on http://localhost:5173
```

You need a browser wallet (e.g. MetaMask) with some Sepolia test ETH to claim cards.

## Layout

- `contracts/` – the Solidity contract (already deployed)
- `server.js` – Express server that pins card images to IPFS through Pinata
- `frontend/` – React + TypeScript site (Vite, viem, vanilla-extract)

Not affiliated with the games or publishers named on the site.
