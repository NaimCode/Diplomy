// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Certification {
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
    ) public {
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

    // function ObtenirDiplome(string memory _hash)
    //     public
    //     view
    //     returns (Diplome memory)
    // {
    //     return Diplomes[_hash];
    // }

    // function NombreTotalDeDiplome() public view returns (uint256) {
    //     return diplomes_keys.length;
    // }

    // function NombreDeDiplomeParEtablissement(string memory _etablissementHash)
    //     public
    //     view
    //     returns (uint256)
    // {
    //     uint256 nombre = 0;
    //     for (uint256 i = 0; i < diplomes_keys.length; i++) {
    //         if (
    //             keccak256(
    //                 bytes(Diplomes[diplomes_keys[i]].etablissementHash)
    //             ) == keccak256(bytes(_etablissementHash))
    //         ) {
    //             nombre++;
    //         }
    //     }

    //     return nombre;
    // }
}
