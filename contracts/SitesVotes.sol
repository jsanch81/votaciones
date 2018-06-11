pragma solidity ^0.4.0;
contract SitesVotes{
    mapping (uint=>bool) registro;
    mapping (uint=>uint) voto;
    mapping (address=>uint) escrutinio;
    event Votar(uint indexed CC, address indexed escru);

    function registroVotante(uint CC) public returns(bool) {
        if(registro[CC]) return false;
        registro[CC] = true;
        voto[CC] = 1;
        return true;
    }

    function votar(uint CC, address escru) public returns(bool)  {
        if(registro[CC] && voto[CC]==1){
            escrutinio[escru]+=voto[CC];
            voto[CC]=0;
            emit Votar(CC, escru);
            return true;
        }
        return false;
    }

    function votantesResgistrados(uint CC) public view returns(bool,uint){
        return (registro[CC],voto[CC]);
    }

    function balanceEscrutinio(address escru) public view returns(uint totalVotos){
        return escrutinio[escru];
    }

}
