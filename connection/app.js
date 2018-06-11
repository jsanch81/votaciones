const contract = require('truffle-contract');
const CryptoJS = require('crypto-js');
var Tx = require('ethereumjs-tx');
var request = require("request");
const notifier = require('node-notifier');
const path = require('path');

const votes_artifact = require('../build/contracts/SitesVotes.json');
const privateKey = new Buffer('8ce30e4aee45067f4d838794c9444292fc891a8d0e34077265806137554d16cc', 'hex');


var SitesVotes = contract(votes_artifact);

module.exports = {
  registroVotante: function(CC,sender,callback) {
    var self = this;
    SitesVotes.setProvider(self.web3.currentProvider);
    //Genero una instancia del contrato compildado
    var MyContract = self.web3.eth.contract(SitesVotes._json.abi);
    //Realizo la instancia del contrato compildado con el desplegado
    var myContractInstance = MyContract.at('0x54739BF46eA9C211f4DEFaE37842fDc4eEDeCf30');
    //Obtengo los datos del contrato, al pasar los parametros requeridos
    var getData = myContractInstance.registroVotante.getData(CC);

    var nonce = self.web3.toHex(self.web3.eth.getTransactionCount(sender));
    var gasPrice = self.web3.toHex(self.web3.eth.gasPrice);
    var gasLimitHex = self.web3.toHex(2000000);
    var rawTx = { 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': sender, 'to':'0x54739BF46eA9C211f4DEFaE37842fDc4eEDeCf30', 'data': getData};

    var tx = new Tx(rawTx);
    tx.sign(privateKey);

    var serializedTx = '0x'+tx.serialize().toString('hex');
    self.votantesResgistrados(CC,function(out1) {
      var result = out1[0];
      if (result) {
          callback([false,out1[1]]);
      }else{
        self.web3.eth.sendRawTransaction(serializedTx, function(err, txHash){
          console.log(err, txHash);
          self.getTransactionReceiptMined(txHash).then(function(receipt) {
            self.votantesResgistrados(CC,function(out) {
              callback(out);
            });
          });
        });
      }
    });

  },
  votar: function(CC,escrutinio,sender,callback) {
    var self = this;

    SitesVotes.setProvider(self.web3.currentProvider);
    //Genero una instancia del contrato compildado
    var MyContract = self.web3.eth.contract(SitesVotes._json.abi);
    //Realizo la instancia del contrato compildado con el desplegado
    var myContractInstance = MyContract.at('0x54739BF46eA9C211f4DEFaE37842fDc4eEDeCf30');
    //Obtengo los datos del contrato, al pasar los parametros requeridos
    var getData = myContractInstance.votar.getData(CC,escrutinio);

    var nonce = self.web3.toHex(self.web3.eth.getTransactionCount(sender));
    var gasPrice = self.web3.toHex(self.web3.eth.gasPrice);
    var gasLimitHex = self.web3.toHex(2000000);
    var rawTx = { 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': sender, 'to':'0x54739BF46eA9C211f4DEFaE37842fDc4eEDeCf30', 'data': getData};

    var tx = new Tx(rawTx);
    tx.sign(privateKey);

    var serializedTx = '0x'+tx.serialize().toString('hex');
    self.votantesResgistrados(CC,function(out1) {
      if(!out1[0]){
        callback("USUARIO NO REGISTRADO");
      }else if(out1[1]==0){
        callback("USUARIO YA VOTO");
      }else {
        self.web3.eth.sendRawTransaction(serializedTx, function(err, txHash){
          console.log(err, txHash);
          self.getTransactionReceiptMined(txHash).then(function(receipt) {
            self.balanceEscrutinio(escrutinio, function(out) {
              callback(out);
            });
          });
        });
      }
    });


  },
  balanceEscrutinio: function(escrutinio,callback) {
    var self = this;
    SitesVotes.setProvider(self.web3.currentProvider);
    //Genero una instancia del contrato compildado
    var MyContract = self.web3.eth.contract(SitesVotes._json.abi);
    //Realizo la instancia del contrato compildado con el desplegado
    var myContractInstance = MyContract.at('0x54739BF46eA9C211f4DEFaE37842fDc4eEDeCf30');

    myContractInstance.balanceEscrutinio.call(escrutinio,function(err,result) {
      console.log(result+"+++++++++++++++++++++++++++++++++++++++++++");
      callback(result);
    });

  },
  votantesResgistrados: function(CC, callback) {
    var self = this;
    SitesVotes.setProvider(self.web3.currentProvider);
    //Genero una instancia del contrato compildado
    var MyContract = self.web3.eth.contract(SitesVotes._json.abi);
    //Realizo la instancia del contrato compildado con el desplegado
    var myContractInstance = MyContract.at('0x54739BF46eA9C211f4DEFaE37842fDc4eEDeCf30');

    myContractInstance.votantesResgistrados.call(CC,function(err,result) {
      console.log(result+"+++++++++++++++++++++++++++++++++++++++++++");
      callback(result);
    });
  },
  getTransactionReceiptMined(txHash, interval) {
      const self = this;
      const transactionReceiptAsync = function(resolve, reject) {
          self.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
              if (error) {
                  reject(error);
              } else if (receipt == null) {
                  setTimeout(
                      () => transactionReceiptAsync(resolve, reject),
                      interval ? interval : 500);
              } else {
                  resolve(receipt);
              }
          });
      };

      if (Array.isArray(txHash)) {
          return Promise.all(txHash.map(
              oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
      } else if (typeof txHash === "string") {
          return new Promise(transactionReceiptAsync);
      } else {
          throw new Error("Invalid Type: " + txHash);
      }
    }

}
