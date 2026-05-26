# NFT Lab – ERC-721 Soulbound Visit Card & ERC-1155 Game Character Collection

## Student Info
- **Name:** Hanna Ivanova
- **ID:** STU-23-HO
- **Course:** Computer Science, Year 3

---

## Deployed Contracts (Sepolia Testnet)

### ERC-721 SoulboundVisitCardERC721
- **Contract:** `0x94FC6B657aC304ddA9e384EadAa7339Ad1E022Bd`
- **Mint TX:** `0x1ab0ed0daf9af0bd3e4c99bbecf3f6505db161fff7f634438fb5cadb75f37021`
- **Metadata:** `ipfs://bafybeibxor23w5mesrtpfpibovgao3fr7rbqowftkfy3pgiqd3ei2inmta/`
- **Etherscan:** https://sepolia.etherscan.io/address/0x94FC6B657aC304ddA9e384EadAa7339Ad1E022Bd#code

### ERC-1155 GameCharacterCollectionERC1155
- **Contract:** `0x8B837Fb7E05bC7245D9Be96b54967FaBC2dB56cA`
- **Batch Mint TX (10 NFTs):** `0x1de3bc690aadb80b7cb53f62d315ba50eff350de06086848f00d12c9b088a24c`
- **Transfer TX (2 to student):** `0xaf6bef51fdd5b80c945cff2ef1e40c6b20b540a2312e71ebd771ba7a38e3253b`
- **Metadata:** `ipfs://bafybeibxor23w5mesrtpfpibovgao3fr7rbqowftkfy3pgiqd3ei2inmta/{id}.json`
- **Etherscan:** https://sepolia.etherscan.io/address/0x8B837Fb7E05bC7245D9Be96b54967FaBC2dB56cA#code

---

## Project Structure
```
nft-lab/
├── contracts/
│   ├── SoulboundVisitCardERC721.sol
│   └── GameCharacterCollectionERC1155.sol
├── scripts/
│   └── deploy.cjs
├── metadata/
│   ├── erc721/  → 1.json
│   └── erc1155/ → 1.json … 10.json
├── hardhat.config.cjs
└── .env
```

---

## Setup & Deploy

### 1. Install dependencies
```bash
npm install
```

### 2. Configure .env
```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
```

### 3. Compile
```bash
npx hardhat compile
```

### 4. Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.cjs --network sepolia
```

### 5. Verify contracts
```bash
# ERC-721
npx hardhat verify --network sepolia 0x94FC6B657aC304ddA9e384EadAa7339Ad1E022Bd "ipfs://bafybeibxor23w5mesrtpfpibovgao3fr7rbqowftkfy3pgiqd3ei2inmta/"

# ERC-1155
npx hardhat verify --network sepolia 0x8B837Fb7E05bC7245D9Be96b54967FaBC2dB56cA "ipfs://bafybeibxor23w5mesrtpfpibovgao3fr7rbqowftkfy3pgiqd3ei2inmta/{id}.json"
```

---

## How It Works

### ERC-721 – Soulbound Visit Card
- Mints exactly **1 token per student wallet**
- Stores `studentName`, `studentID`, `course`, `year` on-chain
- **Soulbound** enforcement via `_update()` override — blocks all transfers
- `approve()` and `setApprovalForAll()` are disabled
- Only contract owner can mint

### ERC-1155 – Game Character Collection
- **10 unique characters** (token IDs 1–10)
- Each has: `color`, `speed`, `strength`, `rarity` attributes
- `mintBatch()` — mints all 10 in **1 transaction** (~70% gas savings vs ERC-721)
- `batchTransfer()` — transfers multiple tokens in 1 transaction
- 2 characters transferred to student wallet

---

## Metadata Structure

### ERC-721 (metadata/erc721/1.json)
```json
{
  "name": "Student Visit Card #1 - Hanna Ivanova",
  "description": "Soulbound student visit card. Non-transferable.",
  "image": "ipfs://.../card1.png",
  "attributes": [
    { "trait_type": "Student Name", "value": "Hanna Ivanova" },
    { "trait_type": "Student ID",   "value": "STU-23-HO" },
    { "trait_type": "Course",       "value": "Computer Science" },
    { "trait_type": "Year",         "display_type": "number", "value": 3 },
    { "trait_type": "Type",         "value": "Soulbound" }
  ]
}
```

### ERC-1155 (metadata/erc1155/1.json)
```json
{
  "name": "Shadow Rogue",
  "description": "A swift rogue who strikes from darkness. Rare tier.",
  "image": "ipfs://.../char1.png",
  "attributes": [
    { "trait_type": "Color",    "value": "Obsidian Black" },
    { "trait_type": "Speed",    "display_type": "number", "value": 92 },
    { "trait_type": "Strength", "display_type": "number", "value": 55 },
    { "trait_type": "Rarity",   "value": "Rare" }
  ]
}
```

---

## Game Characters Reference

| ID | Name | Color | Speed | Strength | Rarity |
|----|------|-------|-------|----------|--------|
| 1  | Shadow Rogue | Obsidian Black | 92 | 55 | Rare |
| 2  | Fire Mage | Crimson Red | 60 | 88 | Epic |
| 3  | Iron Knight | Steel Grey | 40 | 95 | Uncommon |
| 4  | Storm Archer | Electric Blue | 85 | 65 | Rare |
| 5  | Void Warlock | Deep Violet | 50 | 98 | Legendary |
| 6  | Nature Druid | Emerald Green | 70 | 72 | Uncommon |
| 7  | Frost Paladin | Ice White | 55 | 90 | Rare |
| 8  | Thunder Monk | Golden Yellow | 88 | 78 | Epic |
| 9  | Blood Berserker | Scarlet Red | 75 | 99 | Epic |
| 10 | Light Seraph | Radiant White | 65 | 85 | Legendary |

---

## License
MIT