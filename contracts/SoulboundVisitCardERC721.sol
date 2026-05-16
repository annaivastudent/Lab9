// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SoulboundVisitCardERC721 is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId = 1;
    string private _baseTokenURI;

    struct StudentData {
        string studentName;
        string studentID;
        string course;
        uint8  year;
    }

    mapping(uint256 => StudentData) private _studentData;
    mapping(address => bool) private _hasMinted;

    event VisitCardIssued(address indexed to, uint256 indexed tokenId, string studentID);

    error Soulbound__TransferNotAllowed();
    error Soulbound__ApprovalNotAllowed();
    error Soulbound__AlreadyMinted(address wallet);

    constructor(string memory baseURI)
        ERC721("Student Visit Card", "SVC")
        Ownable(msg.sender)
    {
        _baseTokenURI = baseURI;
    }

    function mintVisitCard(
        address to,
        string calldata studentName,
        string calldata studentID,
        string calldata course,
        uint8  year
    ) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        if (_hasMinted[to]) revert Soulbound__AlreadyMinted(to);

        uint256 tokenId = _nextTokenId++;
        _hasMinted[to] = true;

        _studentData[tokenId] = StudentData({
            studentName: studentName,
            studentID:   studentID,
            course:      course,
            year:        year
        });

        _safeMint(to, tokenId);
        emit VisitCardIssued(to, tokenId, studentID);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function getStudentData(uint256 tokenId) external view returns (StudentData memory) {
        _requireOwned(tokenId);
        return _studentData[tokenId];
    }

    function hasCard(address wallet) external view returns (bool) {
        return _hasMinted[wallet];
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal override returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert Soulbound__TransferNotAllowed();
        }
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert Soulbound__ApprovalNotAllowed();
    }

    function setApprovalForAll(address, bool) public pure override {
        revert Soulbound__ApprovalNotAllowed();
    }
}