// // SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.24;

//contracts
import "./Consumer.sol";
import "./Distributor.sol";
import "./Manufacturer.sol";
import "./Retailer.sol";

contract SupplyChain is Retailer, Consumer, Manufacturer, Distributor {
    uint256[] composite;
    mapping(uint256 => Item) items;
    mapping(address => totalItems) ownership;
    mapping(address => totalItems) shipped;

    uint256 randNonce = 0;

    function randMod() internal returns (uint256) {
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % 82589933;
    }

    function deleteItem(uint256 _uin, address x) internal {
        for (uint256 i = 0; i < ownership[x].itemUin.length; i++) {
            if (_uin == ownership[x].itemUin[i]) {
                ownership[x].itemUin[i] = ownership[x].itemUin[
                    ownership[x].itemUin.length - 1
                ];
                ownership[x].itemUin.pop();
                break;
            }
        }
    }

    function deleteItemshipped(uint256 _uin, address x) internal {
        for (uint256 i = 0; i < shipped[x].itemUin.length; i++) {
            if (_uin == shipped[x].itemUin[i]) {
                shipped[x].itemUin[i] = shipped[x].itemUin[
                    shipped[x].itemUin.length - 1
                ];
                shipped[x].itemUin.pop();
                break;
            }
        }
    }

    enum State {
        SProducedByManufacturer,
        SForSaleByManufacturer,
        SShippedByManufacturer,
        SReceivedByDistributor,
        SForSaleByDistributor,
        SShippedByDistributor,
        SReceivedByRetailer,
        SForSaleByRetailer,
        SShippedByRetailer,
        SReceivedByCustomer,
        SCollectibleForSaleByCustomer,
        SShippedByCustomer,
        SReceivedCollectibleByCustomer
    }

    State constant defaultState = State.SProducedByManufacturer;
    struct totalItems {
        uint256 count;
        uint256[] itemUin;
    }
    struct Item {
        uint256 uin;
        string productName;
        string productType;
        string productDescription;
        address payable manufacturerId;
        address payable CurrentOwner;
        address payable ShipTo;
        uint256 productDate;
        bool collectible;
        bool composite;
        bool visibility;
        uint256 weight;
        uint256 productPrice;
        uint256 productHash;
        State productState;
    }
    event EProducedByManufacturer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller
    );
    event EForSaleByManufacturer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );
    event EShippedByManufacturer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );
    event EReceivedByDistributor(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller
    );
    event EForSaleByDistributor(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );
    event EShippedByDistributor(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );
    event EReceivedByRetailer(
        uint256 indexed uin,
        uint256 timeStamp,
        address caller
    );

    event EForSaleByRetailer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );

    event EShippedByRetailer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );

    event EReceivedByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address caller
    );

    event ECollectibleForSaleByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );

    event EShippedtheCollectibleByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );

    event EReceivedCollectibleByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address caller
    );

    modifier paidEnough(uint256 _price) {
        require(msg.value >= _price);
        _;
    }

    modifier MProducedByManufacturer(uint256 _uin) {
        require(items[_uin].productState == State.SProducedByManufacturer);
        _;
    }

    modifier MForSaleByManufacturer(uint256 _uin) {
        require(items[_uin].productState == State.SForSaleByManufacturer);
        _;
    }

    modifier MReceivedByDistributor(uint256 _uin) {
        require(items[_uin].productState == State.SReceivedByDistributor);
        _;
    }

    modifier MShippedByManufacturer(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByManufacturer);
        _;
    }

    modifier MForSaleByDistributor(uint256 _uin) {
        require(items[_uin].productState == State.SForSaleByDistributor);
        _;
    }

    modifier MShippedByDistributor(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByDistributor);
        _;
    }

    modifier MReceivedByRetailer(uint256 _uin) {
        require(items[_uin].productState == State.SReceivedByRetailer);
        _;
    }

    modifier MForSaleByRetailer(uint256 _uin) {
        require(items[_uin].productState == State.SForSaleByRetailer);
        _;
    }

    modifier MShippedByRetailer(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByRetailer);
        _;
    }

    modifier MReceivedByCustomer(uint256 _uin) {
        require(items[_uin].productState == State.SReceivedByCustomer);
        _;
    }

    modifier isCurrentOwner(uint256 _uin) {
        require(msg.sender == items[_uin].CurrentOwner);
        _;
    }

    modifier MCollectibleForSaleByCustomer(uint256 _uin) {
        require(
            items[_uin].productState == State.SCollectibleForSaleByCustomer
        );
        _;
    }

    modifier MShippedCollectibleByCustomer(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByCustomer);
        _;
    }

    modifier MReceivedCollectibleByCustomer(uint256 _uin) {
        require(
            items[_uin].productState == State.SReceivedCollectibleByCustomer
        );
        _;
    }

    modifier MisCollectible(uint256 _uin) {
        require(items[_uin].collectible == true);
        _;
    }

    modifier MVerifyCaller(uint256 _uin) {
        require(items[_uin].productHash == generateHash(_uin, msg.sender));
        _;
    }

    function generateHash(uint256 uin, address shipTo)
        public
        returns (uint256)
    {
        return
            uint256(
                keccak256(
                    abi.encodePacked(uin, items[uin].CurrentOwner, shipTo)
                )
            );
    }

    function producebymanufacturer(
        string memory _ProductName,
        string memory _ProductDesc,
        string memory _ProductType,
        bool _collectible,
        uint256 weight
    ) public onlyManufacturer(msg.sender) returns (uint256) {
        uint256 uin = randMod();
        address payable manufacturer = payable(msg.sender);
        items[uin] = Item(
            uin,
            _ProductName,
            _ProductType,
            _ProductDesc,
            manufacturer,
            manufacturer,
            payable(address(0)),
            block.timestamp,
            _collectible,
            false,
            false,
            weight,
            0,
            0,
            defaultState
        );
        ownership[manufacturer].count++;
        ownership[manufacturer].itemUin.push(uin);
        emit EProducedByManufacturer(uin, block.timestamp, msg.sender);
        return (uin);
    }

    function forsalebymanufacturer(uint256 uin, uint256 price)
        public
        onlyManufacturer(msg.sender)
        isCurrentOwner(uin)
        MProducedByManufacturer(uin)
    {
        items[uin].visibility = true;
        items[uin].productState = State.SForSaleByManufacturer;
        items[uin].productPrice = price;
        emit EForSaleByManufacturer(uin, block.timestamp, msg.sender, price);
    }

    function shippedbymanufacturer(uint256 uin, address payable shipTo)
        public
        onlyManufacturer(msg.sender)
        isCurrentOwner(uin)
        onlyDistributor(shipTo)
        MForSaleByManufacturer(uin)
    {
        items[uin].productState = State.SShippedByManufacturer;
        items[uin].ShipTo = shipTo;
        shipped[shipTo].count++;
        shipped[shipTo].itemUin.push(uin);
        items[uin].productHash = generateHash(uin, shipTo);
        emit EShippedByManufacturer(uin, block.timestamp, msg.sender, shipTo);
    }

    function receivedbydistributor(uint256 uin)
        public
        payable
        onlyDistributor(msg.sender)
        paidEnough(items[uin].productPrice)
        MShippedByManufacturer(uin)
        MVerifyCaller(uin)
    //checkValue(items[uin].productPrice, payable(msg.sender))
    {
        items[uin].productState = State.SReceivedByDistributor;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        deleteItem(uin, items[uin].CurrentOwner);
        ownership[items[uin].CurrentOwner].count--;
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedByDistributor(uin, block.timestamp, msg.sender);
    }

    function forsalebydistributor(uint256 uin, uint256 price)
        public
        onlyDistributor(msg.sender)
        isCurrentOwner(uin)
        MReceivedByDistributor(uin)
    {
        items[uin].visibility = true;
        items[uin].productState = State.SForSaleByDistributor;
        items[uin].productPrice = price;
        emit EForSaleByDistributor(uin, block.timestamp, msg.sender, price);
    }

    function shippedbydistributor(uint256 uin, address payable shipTo)
        public
        onlyDistributor(msg.sender)
        isCurrentOwner(uin)
        onlyRetailer(shipTo)
        MForSaleByDistributor(uin)
    {
        items[uin].productState = State.SShippedByDistributor;
        items[uin].ShipTo = shipTo;
        shipped[shipTo].count++;
        shipped[shipTo].itemUin.push(uin);
        items[uin].productHash = generateHash(uin, shipTo);
        emit EShippedByDistributor(uin, block.timestamp, msg.sender, shipTo);
    }

    function receivedbyretailer(uint256 uin)
        public
        payable
        onlyRetailer(msg.sender)
        paidEnough(items[uin].productPrice)
        MShippedByDistributor(uin)
        MVerifyCaller(uin)
    {
        items[uin].productState = State.SReceivedByRetailer;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        ownership[items[uin].CurrentOwner].count--;
        deleteItem(uin, items[uin].CurrentOwner);
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedByRetailer(uin, block.timestamp, msg.sender);
    }

    function forsalebyretailer(uint256 uin, uint256 price)
        public
        onlyRetailer(msg.sender)
        isCurrentOwner(uin)
        MReceivedByRetailer(uin)
    {
        items[uin].productState = State.SForSaleByRetailer;
        items[uin].productPrice = price;
        emit EForSaleByRetailer(uin, block.timestamp, msg.sender, price);
    }

    function shippedbyretailer(uint256 uin, address payable shipTo)
        public
        onlyRetailer(msg.sender)
        isCurrentOwner(uin)
        onlyConsumer(shipTo)
        MForSaleByRetailer(uin)
    {
        items[uin].productState = State.SShippedByRetailer;
        items[uin].ShipTo = shipTo;
        shipped[shipTo].count++;
        shipped[shipTo].itemUin.push(uin);
        items[uin].productHash = generateHash(uin, shipTo);
        emit EShippedByRetailer(uin, block.timestamp, msg.sender, shipTo);
    }

    function receivedbycustomer(uint256 uin)
        public
        payable
        onlyConsumer(payable(msg.sender))
        paidEnough(items[uin].productPrice)
        MShippedByRetailer(uin)
        MVerifyCaller(uin)
    {
        items[uin].productState = State.SReceivedByCustomer;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        ownership[items[uin].CurrentOwner].count--;
        deleteItem(uin, items[uin].CurrentOwner);
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedByCustomer(uin, block.timestamp, msg.sender);
    }

    function collectibleforsalebycustomer(uint256 uin, uint256 price)
        public
        isCurrentOwner(uin)
        onlyConsumer(payable(msg.sender))
        MReceivedByCustomer(uin)
        MisCollectible(uin)
    {
        items[uin].productState = State.SCollectibleForSaleByCustomer;
        items[uin].productPrice = price;
        items[uin].visibility = true;
        emit ECollectibleForSaleByCustomer(
            uin,
            block.timestamp,
            msg.sender,
            price
        );
    }

    function shippedcollectiblebycustomer(uint256 uin, address payable ShipTo)
        public
        isCurrentOwner(uin)
        onlyConsumer(payable(msg.sender))
        onlyConsumer(ShipTo)
        MCollectibleForSaleByCustomer(uin)
    {
        items[uin].productState = State.SShippedByCustomer;
        items[uin].ShipTo = ShipTo;
        shipped[ShipTo].count++;
        shipped[ShipTo].itemUin.push(uin);
        items[uin].productHash = generateHash(uin, ShipTo);
        emit EShippedtheCollectibleByCustomer(
            uin,
            block.timestamp,
            msg.sender,
            ShipTo
        );
    }

    function receivedcollectiblebycustomer(uint256 uin)
        public
        payable
        onlyConsumer(payable(msg.sender))
        MisCollectible(uin)
        paidEnough(items[uin].productPrice)
        MShippedCollectibleByCustomer(uin)
        MVerifyCaller(uin)
    {
        items[uin].productState = State.SReceivedByCustomer;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        ownership[items[uin].CurrentOwner].count--;
        deleteItem(uin, items[uin].CurrentOwner);
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedCollectibleByCustomer(uin, block.timestamp, msg.sender);
    }

    function productDetail(uint256 uin) public view returns (Item memory) {
        return (items[uin]);
    }

    function getOwnedProducts(address z) public view returns (Item[] memory) {
        Item[] memory item = new Item[](ownership[z].itemUin.length);
        for (uint256 i = 0; i < ownership[z].itemUin.length; i++) {
            Item storage x = items[ownership[z].itemUin[i]];
            item[i] = x;
        }
        return item;
    }

    function getShippedProducts(address z) public view returns (Item[] memory) {
        Item[] memory item = new Item[](shipped[z].itemUin.length);
        for (uint256 i = 0; i < shipped[z].itemUin.length; i++) {
            Item storage x = items[shipped[z].itemUin[i]];
            item[i] = x;
        }
        return item;
    }
}
