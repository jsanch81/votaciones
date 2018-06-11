const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');

var web3 = new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io/hgffnOxaTu7Ydsu5VlTg')  //hgffnOxaTu7Ydsu5VlTg
);

var creator = '0x8C3D5f3c20eC4529aa5664342B1564101C31d765';
var key = '8ce30e4aee45067f4d838794c9444292fc891a8d0e34077265806137554d16cc';


app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressLayouts);

// parse application/json
app.use(bodyParser.json());


app.get('/Registrar',function(req,res) {
  res.render('registrar',{salida: ""});
});
app.get('/consultVotante',function(req,res) {
  res.render('consultarVotante',{salida:""});
});
app.get('/',function(req,res) {
  res.render('balanceEscrutinio');
});





app.post('/Registrar',function(req,res) {
  console.log("**** GET /Registrar ****");
  console.log(req.body);
  let CC = req.body.cc;
  console.log(CC);
  truffle_connect.registroVotante(CC,creator,function(out) {
    console.log(out);
    var mensaje;
    if (!out[0] && out[1]==1) {
      mensaje = "Usuario ya registrado";
    }else if(!out[0] && out[1]==0){
      mensaje = "El usuario ya se encuantra registrado y ya voto";
    }else if(out[0] && out[1]==1) {
      mensaje = "Registro exitoso";
    }
    res.render('registrar',{salida: mensaje});
  });
});
app.post('/consultEscrutinio',function(req,res) {
  let account = req.body.account;
  truffle_connect.balanceEscrutinio(account,function(out) {
    console.log(out);
    res.render('ShowBalance',{data: out});
  });
});

app.post('/consultVotante',function(req,res) {
  let CC = req.body.cc;
  truffle_connect.votantesResgistrados(CC,function(out) {
    console.log(out);
    var mensaje;
    if (out[0]&&out[1]==1) {
      mensaje = "El usuario Se encuantra registrado y no ha votado"
    }else if(out[0]&&out[1]==0){
      mensaje = "El usuario Se encuantra registrado y ya voto"
    }else {
      mensaje = "Usuario no registrado"
    }
    res.render('consultarVotante',{salida:mensaje});
  });
});


app.post('/Votar',function(req,res) {
  console.log(req.body);
  let CC = req.body.cc;
  let escrutinio = req.body.escrutinio;
  truffle_connect.votar(CC,escrutinio,creator,function(out) {
    console.log(out);
    res.status(200).send({salida: out});
  });
});

app.listen(port, () => {

  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    truffle_connect.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  console.log("Express Listening at http://localhost:" + port);

});
