// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


//Verification Contract


contract M { 



    struct Node {
        bool access;
        address addr;
    }


    mapping(address => Node[]) public  accesslist;

    Node[] n;
    



//
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

    event NodeStatus(address indexed source, address indexed destination,string res);
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
    event InstrSent(address indexed sender, address indexed destination, string content, uint256 indsx,uint256 timestamp);
    event InstrRead(address indexed sender, address indexed destination, uint256 indx,uint256 timestamp );
    
    
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
        emit InstrSent(msg.sender, _dest, content,index,block.timestamp);


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
                emit InstrRead(msg.sender, _dest,i, instrList[msg.sender][i].timestamp);
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


