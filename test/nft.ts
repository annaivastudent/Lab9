import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

const ERC721_URI  = "ipfs://bafybeibxor23w5mesrtpfpibovgao3fr7rbqowftkfy3pgiqd3ei2inmta/";
const ERC1155_URI = "ipfs://bafybeicecdkpbdw7xdppoy3xiy7zaktxn62vn4qt5epm6pj2vztfmrcqxa/";

describe("SoulboundVisitCardERC721", function () {
  async function deploy() {
    const [owner, student, other] = await ethers.getSigners();
    const SVC = await ethers.getContractFactory("SoulboundVisitCardERC721");
    const svc = await SVC.deploy(ERC721_URI);
    return { svc, owner, student, other };
  }

  it("Деплоится с правильным именем и символом", async function () {
    const { svc } = await deploy();
    expect(await svc.name()).to.equal("Student Visit Card");
    expect(await svc.symbol()).to.equal("SVC");
  });

  it("Минтит визитку студенту", async function () {
    const { svc, student } = await deploy();
    await svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3);
    expect(await svc.ownerOf(1)).to.equal(student.address);
  });

  it("Записывает данные студента в блокчейн", async function () {
    const { svc, student } = await deploy();
    await svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3);
    const data = await svc.getStudentData(1);
    expect(data.studentName).to.equal("Hanna Ivanova");
    expect(data.studentID).to.equal("STU-23-HO");
    expect(data.course).to.equal("Computer Science");
    expect(data.year).to.equal(3);
  });

  it("Нельзя выдать две визитки одному кошельку", async function () {
    const { svc, student } = await deploy();
    await svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3);
    await expect(
      svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3)
    ).to.be.revertedWithCustomError(svc, "Soulbound__AlreadyMinted");
  });

  it("Нельзя передать токен (soulbound)", async function () {
    const { svc, student, other } = await deploy();
    await svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3);
    await expect(
      svc.connect(student).transferFrom(student.address, other.address, 1)
    ).to.be.revertedWithCustomError(svc, "Soulbound__TransferNotAllowed");
  });

  it("Нельзя дать approve на токен", async function () {
    const { svc, student, other } = await deploy();
    await svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3);
    await expect(
      svc.connect(student).approve(other.address, 1)
    ).to.be.revertedWithCustomError(svc, "Soulbound__ApprovalNotAllowed");
  });

  it("Только владелец может минтить", async function () {
    const { svc, student } = await deploy();
    await expect(
      svc.connect(student).mintVisitCard(student.address, "X", "Y", "Z", 1)
    ).to.be.revertedWithCustomError(svc, "OwnableUnauthorizedAccount");
  });

  it("hasCard возвращает true после минта", async function () {
    const { svc, student } = await deploy();
    expect(await svc.hasCard(student.address)).to.equal(false);
    await svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3);
    expect(await svc.hasCard(student.address)).to.equal(true);
  });

  it("tokenURI возвращает правильный адрес", async function () {
    const { svc, student } = await deploy();
    await svc.mintVisitCard(student.address, "Hanna Ivanova", "STU-23-HO", "Computer Science", 3);
    expect(await svc.tokenURI(1)).to.equal(ERC721_URI + "1.json");
  });
});

describe("GameCharacterCollectionERC1155", function () {
  async function deploy() {
    const [owner, student, other] = await ethers.getSigners();
    const GCC = await ethers.getContractFactory("GameCharacterCollectionERC1155");
    const gcc = await GCC.deploy(ERC1155_URI);
    return { gcc, owner, student, other };
  }

  it("Деплоится с 10 персонажами", async function () {
    const { gcc } = await deploy();
    expect(await gcc.TOTAL_CHARACTERS()).to.equal(10);
  });

  it("Батч-минт создаёт всех 10 персонажей", async function () {
    const { gcc, owner } = await deploy();
    await gcc.mintBatch(
      owner.address,
      [1,2,3,4,5,6,7,8,9,10],
      [1,1,1,1,1,1,1,1,1,1],
      "0x"
    );
    for (let i = 1; i <= 10; i++) {
      expect(await gcc.balanceOf(owner.address, i)).to.equal(1);
    }
  });

  it("Атрибуты персонажей записаны правильно", async function () {
    const { gcc } = await deploy();
    const char = await gcc.getCharacter(1);
    expect(char.name).to.equal("Shadow Rogue");
    expect(char.color).to.equal("Obsidian Black");
    expect(char.speed).to.equal(92);
    expect(char.strength).to.equal(55);
  });

  it("Редкость возвращается правильно", async function () {
    const { gcc } = await deploy();
    expect(await gcc.getRarityName(5)).to.equal("Legendary"); // Void Warlock
    expect(await gcc.getRarityName(3)).to.equal("Uncommon");  // Iron Knight
    expect(await gcc.getRarityName(1)).to.equal("Rare");      // Shadow Rogue
  });

  it("Трансфер персонажей работает", async function () {
    const { gcc, owner, student } = await deploy();
    await gcc.mintBatch(owner.address, [1,2], [1,1], "0x");
    await gcc.batchTransfer(student.address, [1,2], [1,1], "0x");
    expect(await gcc.balanceOf(student.address, 1)).to.equal(1);
    expect(await gcc.balanceOf(student.address, 2)).to.equal(1);
    expect(await gcc.balanceOf(owner.address, 1)).to.equal(0);
  });

  it("Нельзя обратиться к несуществующему персонажу", async function () {
    const { gcc } = await deploy();
    await expect(gcc.getCharacter(0)).to.be.revertedWithCustomError(gcc, "InvalidTokenId");
    await expect(gcc.getCharacter(11)).to.be.revertedWithCustomError(gcc, "InvalidTokenId");
  });

  it("Только владелец может минтить", async function () {
    const { gcc, student } = await deploy();
    await expect(
      gcc.connect(student).mintBatch(student.address, [1], [1], "0x")
    ).to.be.revertedWithCustomError(gcc, "OwnableUnauthorizedAccount");
  });

  it("uri возвращает правильный адрес", async function () {
    const { gcc } = await deploy();
    expect(await gcc.uri(5)).to.equal(ERC1155_URI + "5.json");
  });
});