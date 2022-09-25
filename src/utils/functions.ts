import { Diplome, Formation, Version } from "@prisma/client";

type isVirtuelProps={
    formation:Formation&{diplome:Diplome|undefined,versions:Array<Version&{diplome:Diplome}>}
}
export const isVirtuel=({formation}:isVirtuelProps)=>{
if(formation.versionnage){
    const versions=formation.versions
    return versions[versions.length-1]?.diplome.estVirtuel
}else {
    return formation.diplome!.estVirtuel
}
}