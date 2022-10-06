import { Version, Diplome, Formation, Etablissement, ContractMembre, Contract, Transaction, Etudiant } from "@prisma/client";


export type MVersion = Version & {
    diplome: Diplome;
  };
  export type MFormation = Formation & {
    diplome: Diplome;
    versions: Array<MVersion>;
    etablissement:MEtablissement
  };
  
  export type MEtablissement = Etablissement & {
    formations: Array<MFormation>;
    etudiants:Array<Etudiant>
  };
  
  export  type MContractMembre =
    ContractMembre & {
      etablissement: MEtablissement;
    }
  ;
  
  export type MContract = Contract & {
    aboutissement: MFormation;
    transaction:Transaction,
    membres: Array<MContractMembre>;
  };