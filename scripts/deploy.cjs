const { ethers } = require("hardhat");

const ERC721_BASE_URI  = "ipfs://bafybeibxor23w5mesrtpfpibovgao3fr7rbqowftkfy3pgiqd3ei2inmta/";
const ERC1155_BASE_URI = "ipfs://bafybeicecdkpbdw7xdppoy3xiy7zaktxn62vn4qt5epm6pj2vztfmrcqxa/";

const STUDENT_WALLET = "0xA0621ed2b9cC8D2484Ba67fAB7226DDdFBB66bd0";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1. Deploy ERC-721
  console.log("\n▶ Deploying SoulboundVisitCardERC721...");
  const SVC = await ethers.getContractFactory("SoulboundVisitCardERC721");
  const svc = await SVC.deploy(ERC721_BASE_URI);
  await svc.waitForDeployment();
  console.log("✔ SoulboundVisitCardERC721:", await svc.getAddress());

  // 2. Mint visit card
  console.log("\n▶ Minting visit card...");
  const tx1 = await svc.mintVisitCard(
    STUDENT_WALLET,
    "Hanna Ivanova",  
    "STU-23-HO",     
    "Computer Science",
    3
  );
  const r1 = await tx1.wait();
  console.log("✔ Visit card minted! TX:", r1.hash);

  // 3. Deploy ERC-1155
  console.log("\n▶ Deploying GameCharacterCollectionERC1155...");
  const GCC = await ethers.getContractFactory("GameCharacterCollectionERC1155");
  const gcc = await GCC.deploy(ERC1155_BASE_URI);
  await gcc.waitForDeployment();
  console.log("✔ GameCharacterCollectionERC1155:", await gcc.getAddress());

  // 4. Batch mint 10 characters
  console.log("\n▶ Batch minting 10 characters...");
  const tx2 = await gcc.mintBatch(
    deployer.address,
    [1,2,3,4,5,6,7,8,9,10],
    [1,1,1,1,1,1,1,1,1,1],
    "0x"
  );
  const r2 = await tx2.wait();
  console.log("✔ Batch mint done! TX:", r2.hash);

  // 5. Transfer 2 characters to student
  console.log("\n▶ Transferring 2 characters to student...");
  const tx3 = await gcc.batchTransfer(
    STUDENT_WALLET,
    [1, 2],
    [1, 1],
    "0x"
  );
  const r3 = await tx3.wait();
  console.log("✔ Transfer done! TX:", r3.hash);

  console.log("\n═══════════════════════════════════");
  console.log("ERC-721 :", await svc.getAddress());
  console.log("ERC-1155:", await gcc.getAddress());
  console.log("═══════════════════════════════════");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });