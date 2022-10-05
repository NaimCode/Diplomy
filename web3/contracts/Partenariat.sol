// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Partenariat {
    string[] internal  partenaires;
    string[] internal formations_requises;
    string internal formation_aboutissante;
    uint price;

    constructor(string[] memory _partenaires,string[] memory _formations_requises,string memory _formation_aboutissante,string[] memory _partenaires_name,string[] memory _formations_requises_name,string memory _formation_aboutissante_name,uint _price){
       partenaires=_partenaires;
       formations_requises=_formations_requises;
       formation_aboutissante=_formation_aboutissante;
       price=_price;
       
       emit EventPartenariat(
        _partenaires_name,
        _formations_requises_name,
        _formation_aboutissante_name
       );

    }

// function getInfo()public view returns(string[] memory,string[] memory,string memory){
//   return (partenaires,formations_requises,formation_aboutissante);
// }
  function comparingString(string memory _s1,string memory _s2)pure internal returns(bool){
      if (keccak256(abi.encodePacked(_s1)) == keccak256(abi.encodePacked(_s2))) {
        return true;
  }
  else {
    return false;
  }
 
}
    function check(string[] memory _partenaires,string[] memory _formations_requises) public view returns(string memory) {
      bool _check=true;
         if(partenaires.length ==_partenaires.length){
               for (uint i = 0; i < partenaires.length; i++) {
                  if(!comparingString(partenaires[i], _partenaires[i])){
                       _check=false;
                  }
               }

              
         }else{
            _check=false;
         }
       if(_check){
             if(formations_requises.length ==_formations_requises.length){
               for (uint i = 0; i < formations_requises.length; i++) {
                  if(!comparingString(formations_requises[i], _formations_requises[i])){
                       _check=false;
                  }
               }
          
         }else{
            _check=false;
         }


     
    }

    if(_check){
      return formation_aboutissante;
    
    }else{
      return "";
    }

  }

    event EventPartenariat(
     string[] Partenaires,
     string[] FormationsRequises,
     string  FormationAboutissante
    );
}
