var SitesVotes = artifacts.require("./SitesVotes.sol");
module.exports = function(deployer) {
  deployer.deploy(SitesVotes);
};
