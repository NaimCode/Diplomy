// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./Certification";

contract Partenariat {
    string[] public partenaires;
    string[] public formations_requises;
    string public formation_aboutissante;

   
    uint public price;

  


    constructor(string[] memory _partenaires,string[] memory _formations_requises,string memory _formation_aboutissante,uint _price){
       partenaires=_partenaires;
       formations_requises=_formations_requises;
       formation_aboutissante=_formation_aboutissante;
       price=_price;
    

    }

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

}
