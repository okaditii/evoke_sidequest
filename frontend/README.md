# Evoke Sidequest — frontend

React + TypeScript (Vite), styled with vanilla-extract (`*.css.ts`), talking to the existing
`ArtGallery` contract on Sepolia (`0xCDc6E9B074F2422f2BD1EdfCC9C9813ac0E52f57`) through viem.
The contract is unchanged.

```
# 1. upload server (repo root) – needed for claiming and forging
node server.js                # http://localhost:5000, uses PINATA_* from ../.env

# 2. the site
cd frontend
npm install
npm run dev                   # http://localhost:5173
npm run build                 # type-check + production build into dist/
```

Optional settings go in `frontend/.env` (see `.env.example`): `VITE_RPC_URL`, `VITE_UPLOAD_API`.

Reward details (game, genre, rarity, type, lore, quest) are stored in the token's description as
`EVOKE1:{json}`, so the existing contract needs no changes. Older non-game uploads on the contract are hidden.
