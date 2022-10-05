// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Certification {
    address public owner;
    uint public price;

    constructor(uint _price) {
        owner = msg.sender;
        price=_price;

    }
    function ChangePrice(uint _price) public{
        require(msg.sender==owner,"Not Authorized");
        price=_price;
    }

    struct Diplome {
        string nom;
        string prenom;
        string intitule;
        string etablissementHash;
        string documentHash;
        string version;
        string expiration;
        string diplomeType;
        address signataire;

    }
    function Test()public{}
    function NouveauDiplome(
        string memory _intitule,
        string memory _documentHash,
        string memory _nom,
        string memory _etablissementHash,
        string memory _prenom,
        string memory _version,
        string memory _expiration,
        string memory _diplomeType,
        address  _signataire
    ) public payable {
       
        require(msg.value >= price, "Value");
        bool sent =  payable(owner).send(msg.value);
        require(sent, "Failed to send Ether");

        // diplomes_keys.push(_etudiantHash);

        // Diplomes[_etudiantHash] = Diplome({
        //     intitule: _intitule,
        //     etablissement: _etablissement,
        //     etablissementHash: _etablissementHash,
        //     documentHash: _documentHash,
        //     documentLink: _documentLink,
        //     nom: _nom,
        //     prenom: _prenom,
        //     etudiantHash: _etudiantHash
        // });
        emit EventCertification(
            _nom,
            _prenom,
            _intitule,
            _version,
            _etablissementHash,
            _documentHash,
            _expiration,
            _diplomeType,
            _signataire
        );
    }

    event EventCertification(
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
