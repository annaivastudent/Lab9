// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameCharacterCollectionERC1155 is ERC1155, Ownable {
    using Strings for uint256;

    uint256 public constant TOTAL_CHARACTERS = 10;

    uint256 public constant SHADOW_ROGUE      = 1;
    uint256 public constant FIRE_MAGE         = 2;
    uint256 public constant IRON_KNIGHT       = 3;
    uint256 public constant STORM_ARCHER      = 4;
    uint256 public constant VOID_WARLOCK      = 5;
    uint256 public constant NATURE_DRUID      = 6;
    uint256 public constant FROST_PALADIN     = 7;
    uint256 public constant THUNDER_MONK      = 8;
    uint256 public constant BLOOD_BERSERKER   = 9;
    uint256 public constant LIGHT_SERAPH      = 10;

    struct CharacterAttributes {
        string  name;
        string  color;
        uint8   speed;
        uint8   strength;
        uint8   rarity;
        uint256 supply;
    }

    mapping(uint256 => CharacterAttributes) private _characters;
    string[5] private _rarityNames;

    event CharacterMinted(address indexed to, uint256 indexed tokenId, uint256 amount);
    event BatchMinted(address indexed to, uint256[] ids, uint256[] amounts);

    error InvalidTokenId(uint256 tokenId);
    error ArrayLengthMismatch();

    constructor(string memory baseURI)
        ERC1155(baseURI)
        Ownable(msg.sender)
    {
        _rarityNames[0] = "Common";
        _rarityNames[1] = "Uncommon";
        _rarityNames[2] = "Rare";
        _rarityNames[3] = "Epic";
        _rarityNames[4] = "Legendary";

        _characters[1]  = CharacterAttributes("Shadow Rogue",    "Obsidian Black",  92, 55, 2, 0);
        _characters[2]  = CharacterAttributes("Fire Mage",       "Crimson Red",     60, 88, 3, 0);
        _characters[3]  = CharacterAttributes("Iron Knight",     "Steel Grey",      40, 95, 1, 0);
        _characters[4]  = CharacterAttributes("Storm Archer",    "Electric Blue",   85, 65, 2, 0);
        _characters[5]  = CharacterAttributes("Void Warlock",    "Deep Violet",     50, 98, 4, 0);
        _characters[6]  = CharacterAttributes("Nature Druid",    "Emerald Green",   70, 72, 1, 0);
        _characters[7]  = CharacterAttributes("Frost Paladin",   "Ice White",       55, 90, 2, 0);
        _characters[8]  = CharacterAttributes("Thunder Monk",    "Golden Yellow",   88, 78, 3, 0);
        _characters[9]  = CharacterAttributes("Blood Berserker", "Scarlet Red",     75, 99, 3, 0);
        _characters[10] = CharacterAttributes("Light Seraph",    "Radiant White",   65, 85, 4, 0);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        _validateId(tokenId);
        return string(abi.encodePacked(super.uri(tokenId), tokenId.toString(), ".json"));
    }

    function mint(address to, uint256 tokenId, uint256 amount, bytes calldata data)
        external onlyOwner
    {
        _validateId(tokenId);
        _characters[tokenId].supply += amount;
        _mint(to, tokenId, amount, data);
        emit CharacterMinted(to, tokenId, amount);
    }

    function mintBatch(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external onlyOwner {
        if (ids.length != amounts.length) revert ArrayLengthMismatch();
        for (uint256 i = 0; i < ids.length; i++) {
            _validateId(ids[i]);
            _characters[ids[i]].supply += amounts[i];
        }
        _mintBatch(to, ids, amounts, data);
        emit BatchMinted(to, ids, amounts);
    }

    function batchTransfer(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external {
        safeBatchTransferFrom(msg.sender, to, ids, amounts, data);
    }

    function getCharacter(uint256 tokenId)
        external view returns (CharacterAttributes memory)
    {
        _validateId(tokenId);
        return _characters[tokenId];
    }

    function getRarityName(uint256 tokenId) external view returns (string memory) {
        _validateId(tokenId);
        return _rarityNames[_characters[tokenId].rarity];
    }

    function setURI(string calldata newURI) external onlyOwner {
        _setURI(newURI);
    }

    function _validateId(uint256 tokenId) internal pure {
        if (tokenId == 0 || tokenId > TOTAL_CHARACTERS) {
            revert InvalidTokenId(tokenId);
        }
    }
}