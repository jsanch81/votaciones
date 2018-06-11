var SitesVotes = artifacts.require("./SitesVotes.sol");

contract("SitesVotes",function(accounts) {
  it("Should register a voter",function() {
    var meta;
    var cc = 1017249975;
    var cc2 = 15263673;
    var jurado = accounts[0];
    var escrutinio = accounts[1];
    return SitesVotes.deployed().then(function(instance) {
      meta = instance;
      return meta.registroVotante(cc, {from: jurado});
    }).then(function() {
      return meta.registroVotante(cc2, {from: jurado});
    }).then(function() {
      return meta.votantesResgistrados.call(cc);
    }).then(function(out) {
      console.log(out);
      return meta.votar(cc,escrutinio, {from: jurado});
    }).then(function() {
      return meta.votar(cc2,escrutinio, {from: jurado});
    }).then(function() {
      return meta.balanceEscrutinio.call(escrutinio);
    }).then(function(out) {
      console.log(out);
      return meta.votantesResgistrados.call(cc);
    }).then(function(out) {
      console.log(out);
    })
  });
});
