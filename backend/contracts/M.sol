// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

//Verification Contract

contract M {
    struct Node {
        bool access;
        address addr;
    }

    mapping(address => Node[]) public accesslist;

    Node[] n;

    function AddtoList(
        address dad,
        address ad,
        bool acc
    ) public {
        Node memory m;
        m.addr = ad;
        m.access = acc;
        Node[] storage q = accesslist[dad];
        q.push(m);
    }

    event NodeStatus(
        address indexed source,
        address indexed destination,
        string res,
        uint256 timestamp
    );
    event Blacklisted(
        address indexed sender,
        address indexed destination,
        uint256 timestamp
    );

    // Function to check if an address is verified in the access list of a given address
    function isVerified(address dad, address ad) public {
        Node[] storage nodes = accesslist[dad];
        require(nodes.length > 0, "No Access Rights found for this sender.");

        uint256 v = 0;
        for (uint256 i = 0; i < nodes.length; i++) {
            if (nodes[i].addr == ad) {
                if (nodes[i].access == true) {
                    v = 1;
                    Instr[] memory adi = instrList[ad];
                    Instr memory ii;
                    require(
                        adi.length > 0,
                        "No instructions found for this sender."
                    );
                    for (uint256 j = 1; j < adi.length; j++) {
                        if (adi[j].destination == dad) {
                            ii = adi[j];
                            break;
                        }
                    }

                    addblackList(ad, ii);
                    break;
                } else {
                    v = 0;
                }
            }
        }
        if (v == 0) {
            emit NodeStatus(msg.sender, ad, "illegal", block.timestamp);
        } else if (v == 1) {
            emit NodeStatus(msg.sender, ad, "verified", block.timestamp);
        }
    }

    struct Instr {
        address sender;
        address destination;
        string content;
        uint256 timestamp;
        bool isRead;
    }

    struct BL {
        address a;
        Instr inst;
    }

    BL[] public blackList;
    mapping(address => Instr[]) public instrList;
    event InstrSent(
        address indexed sender,
        address indexed destination,
        string content,
        uint256 indsx,
        uint256 timestamp
    );
    event InstrRead(
        address indexed sender,
        address indexed destination,
        uint256 indx,
        uint256 timestamp
    );

    function sendInstr(address _dest, string memory content) public {
        Instr memory instr = Instr({
            sender: msg.sender,
            destination: _dest,
            content: content,
            isRead: false,
            timestamp: block.timestamp
        });
        instrList[msg.sender].push(instr);
        uint256 index = instrList[msg.sender].length - 1;
        emit InstrSent(msg.sender, _dest, content, index, block.timestamp);
    }

    function getInstr() public view returns (Instr[] memory) {
        return instrList[msg.sender];
    }

    function getAccessListElement(address _addr)
        public
        view
        returns (Node memory j)
    {
        Node[] storage list = accesslist[msg.sender];
        Node memory node;
        for (uint256 i; i < list.length; i++) {
            if (list[i].addr == _addr) {
                return (node);
            }
        }
    }

    function instrRead(address src, address _dest, uint256 index) public {
        require(instrList[src].length > 0, "Invalid message index");
        Instr[] memory ia = instrList[src];
        if (ia[index].destination == _dest && ia[index].isRead == false) {
            instrList[src][index].isRead = true;
            emit InstrRead(src, _dest, index, block.timestamp);
        }
    }

    function getLatestInstr(address _destination)
        public
        view
        returns (Instr memory ins)
    {
        ins.content = "null";
        require(
            instrList[msg.sender].length > 0,
            "No instructions found for this sender."
        );
        Instr[] memory il = instrList[msg.sender];
        for (uint256 i; i < il.length; i++) {
            if (il[i].destination == _destination && il[i].isRead == false) {
                ins = il[i];
                return ins;
            }
        }
    }

    function alCount(address a) public view returns (Node[] memory, uint256) {
        return (accesslist[a], accesslist[a].length);
    }

    function addblackList(address a, Instr memory ins) public {
        BL memory b;
        b.a = a;
        b.inst = ins;
        blackList.push(b);
        emit Blacklisted(a, msg.sender, block.timestamp);
    }

    function getblackList() public view returns (BL[] memory) {
        return blackList;
    }
}