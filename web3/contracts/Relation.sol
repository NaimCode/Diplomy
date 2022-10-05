// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./Partenariat.sol";


contract Relation {
    address public owner;
    uint public price;

    Partenariat[] partenariats;

    constructor(uint _price) {
        owner = msg.sender;
        price=_price;

    }
    function ChangePrice(uint _price) public{
        require(msg.sender==owner,"Not Authorized");
        price=_price;
    }

    function NouveauContract(string[] memory _partenaires,string[] memory _formations_requises,string memory _formation_aboutissante)public payable returns(string memory){
        require(msg.value >= price, "Value");
        bool sent =  payable(owner).send(msg.value);
        require(sent, "Failed to send Ether");
        
        Partenariat _contract=new Partenariat(_partenaires,_formations_requises,_formation_aboutissante);

        
    }

     event EventContract(
        string Nom,
        string Prenom,
        string Intitule,
        string Version,
        string EtablissementHash,
        string DocumentHash,
        string Expiration,
        string Type,
        address Signataire
    );
}


