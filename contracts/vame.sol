// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract VeFame is ERC721Royalty, Ownable {

  string private baseTokenURI;
  string private baseTokenURIExtension;
  uint private mintPrice;
  uint16 private royaltyBasis;
  bytes32 private merkleRoot;
 
  struct TileData {
        string name;
        string image_data;
        string url;
        uint price;
        }

  mapping (uint => TileData) private tileData;
  mapping (address => bool) public whitelistClaimed;

  event TileUpdated(uint tokenId);

  constructor() ERC721("Wall of Vame", "VAME") {
      mintPrice = 1000000000000000000000;
      royaltyBasis = 350; // 3.5%
  }

  function mintTo(address recipient, uint tokenId) public payable returns (uint256) {
    require(!_exists(tokenId), "Tile already minted");
    require(tokenId < 3969, "Invalid tokenId");
    require(msg.value == mintPrice || _msgSender() == owner(), "Transaction value did not equal the mint price");
    
    _safeMint(recipient, tokenId);
    tileData[tokenId].price = 0;
    return tokenId;
  }

  function mintDetailed(address recipient, uint tokenId, string memory name, string memory image_data, string memory url) public onlyOwner returns (uint256) {
    require(!_exists(tokenId), "Tile already minted");
    require(tokenId < 3969, "Invalid tokenId");
    
    _safeMint(recipient, tokenId);
    tileData[tokenId].name = name;
    tileData[tokenId].image_data = image_data;
    tileData[tokenId].url = url;
    tileData[tokenId].price = 0;
    return tokenId;
  }

  function whitelistMint(bytes32[] calldata _merkleProof, address recipient, uint tokenId) public returns (uint) {
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    
    require(!whitelistClaimed[msg.sender], "Address has already claimed");
    require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Not on whitelist");
    require(!_exists(tokenId), "Tile already minted");
    require(tokenId < 3969, "Invalid tokenId");

    whitelistClaimed[msg.sender] = true;
    _safeMint(recipient, tokenId);
    tileData[tokenId].price = 0;
    return tokenId;
  }

  function setMintPrice(uint _mintPrice) public onlyOwner {
      mintPrice = _mintPrice;
  }

  function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
    baseTokenURI = _baseTokenURI;
  }

  function setBaseTokenURIExtension(string memory _baseTokenURIExtension) public onlyOwner {
    baseTokenURIExtension = _baseTokenURIExtension;
  }

  function setTileData(uint tokenId, string memory name, string memory image_data, string memory url) public {
      address owner = ERC721.ownerOf(tokenId);
      require(owner == _msgSender(), "You are not the owner");
          tileData[tokenId].name = name;
          tileData[tokenId].image_data = image_data;
          tileData[tokenId].url = url;
          emit TileUpdated(tokenId);
  }

  function setTilePrice(uint tokenId, uint price) public {
      address owner = ERC721.ownerOf(tokenId);
      require(owner == _msgSender(), "You are not the owner");
      tileData[tokenId].price = price;
      if (price > 0) {
        approve(address(this), tokenId);
      }
  }

  function getTile(uint tokenId) public view returns (string memory name, string memory image_data, string memory url, uint price, address owner, address approved) {
      address _tokenOwner = ERC721.ownerOf(tokenId);
      address _approved = ERC721.getApproved(tokenId);
      return (tileData[tokenId].name, tileData[tokenId].image_data, tileData[tokenId].url, tileData[tokenId].price, _tokenOwner, _approved);
  }

  function withdrawPayments() public onlyOwner {
    payable(msg.sender).transfer(address(this).balance);
  }

  function tokenURI(uint256 tokenId) override(ERC721) public view returns (string memory) {
    return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId), baseTokenURIExtension));
  }    

  function royaltyInfo(uint _tokenId, uint _salePrice) external view override returns (address receiver, uint royaltyAmount) {
    return (owner(), uint((_salePrice * royaltyBasis)/10000));
  }

  function setRoyalties(uint16 _royaltyBasis) internal {
    royaltyBasis = _royaltyBasis;
  }

  function buyTile(uint tokenId) public payable {
      address owner = ERC721.ownerOf(tokenId);
      uint salePrice = tileData[tokenId].price;

      require(owner != msg.sender, "You already own this token.");
      require(salePrice != 0, "Token not for sale.");
      require(salePrice == msg.value, "Incorrect price.");
      
      uint finalProceeds = salePrice - ((salePrice * royaltyBasis)/10000);
      payable(owner).transfer(finalProceeds);
      this.safeTransferFrom(owner, msg.sender, tokenId);
      tileData[tokenId].price = 0;
      emit TileUpdated(tokenId);
  }

  function setWhitelistRoot(bytes32 _root) external onlyOwner {
    merkleRoot = _root;
  }

}
