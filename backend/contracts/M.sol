// SPDX-License-Identifier: MIT


//Verification Contract

pragma solidity >=0.6.0 <0.9.0;



contract M { 

    

    struct Node {
        bool access;
        address addr;
    }



    address[3] private addressList = [
        0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
        0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
        0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
    ];
    address[] public publicList = [
        0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
        0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
        0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db,
        0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB
    ];

    mapping(address => Node[]) public  accesslist;

    Node[] n;
    



    //Adding to array with bool value
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

    function init_List() public {
        // Mapping Access List

        AddtoList(addressList[0], addressList[1], true); // d: 0x2612AF8C0e3f44E6711c87db15470ef1069C296b, ad: 0x80E909b6aD68d27D22AA3866aa3cba8dbeee2ECd
        AddtoList(addressList[0], addressList[2], false); // d: 0x2612AF8C0e3f44E6711c87db15470ef1069C296b, ad: 0xd15368c8038fff5a8096c79D4cB143F7B184aF14
    }
    event NodeStatus(address indexed source, address indexed destination,string indexed res);
    // Function to check if an address is verified in the access list of a given address
    function isVerified(address dad, address ad) public  {
        Node[] storage nodes = accesslist[dad];
        uint256  v = 0;
        for (uint256 i = 0; i < nodes.length; i++) {
            if (nodes[i].addr == ad) {
                if (nodes[i].access==true) {
                    v = 1;
                    break;
                } 
                else {
                    v =0;
                }
            }
        }
        //Instr memory ins = getLatestInstr(ad);

        if (v == 0) {
            emit NodeStatus(msg.sender,ad,"false");

        }
        else if (v==1) {
            emit NodeStatus(msg.sender,ad,"true");

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
    mapping (address => Instr[]) public instrList;
    event InstrSent(address indexed sender, address indexed destination, string content, uint256 indsx);
    event InstrRead(address indexed sender, address indexed destination, uint256 indx );
    
    
    function sendInstr (address _dest, string memory content) public  {

        Instr memory instr = Instr(
            {
                sender:msg.sender,
                destination:_dest,
                content:content,
                isRead:false,
                timestamp:block.timestamp
            }
        );
        instrList[msg.sender].push(instr);
        uint256 index = instrList[msg.sender].length -1;
        emit InstrSent(msg.sender, _dest, content,index);


}

    function getInstr() public view returns (Instr[] memory) {
        return instrList[msg.sender];
    }

    function getAccessList() public view returns (Node[] memory) {
        return accesslist[msg.sender];
        
    }

    function getAccessListElement(address _addr) public view returns (Node memory j) {
    Node[] storage list = accesslist[msg.sender];
    Node memory node;
    for(uint256 i;i<list.length;i++) {
        if (list[i].addr == _addr) {
            return (node);
        }
    } 

    }


    function instrRead(address _dest) public {

        require(instrList[msg.sender].length > 0, "Invalid message index");
        Instr[] memory ia = instrList[msg.sender];
        for(uint256 i;i<ia.length;i++) {
            if (instrList[msg.sender][i].destination ==_dest && instrList[msg.sender][i].isRead ==false) {
                
                instrList[msg.sender][i].isRead = true;
                emit InstrRead(msg.sender, _dest,i);
                break;  

            }
        }
    }

    function getLatestInstr(address _destination) public view returns (Instr memory ins) {
        ins.content = "null";
         require(instrList[msg.sender].length > 0, "No instructions found for this sender.");
         Instr[] memory il = instrList[msg.sender];
         for(uint256 i;i<il.length;i++) {
            if (il[i].destination == _destination && il[i].isRead ==false) {
                ins = il[i]; 
                return ins;
            }
         }
         
    }
    function alCount(address a) public view returns(Node[] memory,uint256) {
        return (accesslist[a],accesslist[a].length);
    }
    
    function addblackList(address a, Instr memory ins) public {
        BL memory b;
        b.a = a;
        b.inst = ins;
        blackList.push(b);
        emit NodeStatus(msg.sender,ins.destination,'Blacklisted');
    }

}


