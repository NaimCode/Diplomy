const Certification = artifacts.require("Certification");



module.exports = function (deployer) {
  //3710000000000000=>$4.90
  //4000000000000000
  //3710000000000000
  deployer.deploy(Certification,3900000000000000);
};
