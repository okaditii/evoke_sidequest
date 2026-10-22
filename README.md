# evoke_sidequest

Evoke Sidequest turns the quests you finish in your favourite games into collectible character cards you own, minted on Ethereum Sepolia.

- **Cards:** six tiers (Bronze → Silver → Gold → Platinum → Diamond → Ultra Legendary). Harder tasks earn higher tiers. Minted card images are generated in code.
- **Games:** Valorant, League of Legends, Fortnite, CS2, Dota 2, Overwatch 2, Apex Legends, EA SPORTS FC, Clash Royale, Mortal Kombat 1 and God of War: 83 character cards across 8 genres, each with official art loaded at view time (never copied or minted), one of seven tiers (Base to Ultra Legendary), an overall rating and six skill stats. Logos come from Wikimedia Commons; footer credits list every art source.
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
