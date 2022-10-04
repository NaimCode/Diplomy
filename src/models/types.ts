import { Version, Diplome, Formation, Etablissement, ContractMembre } from "@prisma/client";
import { Contract } from "ethers";

export type MVersion = Version & {
    diplome: Diplome;
  };
  export type MFormation = Formation & {
    diplome: Diplome;
    versions: Array<MVersion>;
  };
  
  export type MEtablissement = Etablissement & {
    formations: Array<MFormation>;
  };
  
  export  type MContractMembre = Array<
    ContractMembre & {
      etablissement: MEtablissement;
    }
  >;
  
  export type MContract = Contract & {
    aboutissement: MFormation;
    membres: MContractMembre;
  };