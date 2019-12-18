const {Blockchain, Transaction} = require('../fincrowd/blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('52a0296cf4bdf8d7fda9f8c4a81bd5914389f72f475c28bb0f50c3a28bcfb88e');
const myWallet = myKey.getPublic('hex');

let fincrowdCoin = new Blockchain();

const tx1 = new Transaction(myWallet, 'public key ha', 10);
tx1.signTransaction(myKey);

fincrowdCoin.addTransaction(tx1);

fincrowdCoin.minePendingTransactions(myWallet);

fincrowdCoin.getBalanceOfAddress(myWallet);

console.log(fincrowdCoin.isValidChain());
//console.log(fincrowdCoin.chain[1].transactions)
/*
console.log("mining block1 ...");
fin_crowd.addBlock(new Block(1,new Date().getTime(),"first block",fin_crowd.getLatestBlock().hash));
console.log("mining block2 ...");
fin_crowd.addBlock(new Block(2,new Date().getTime(),"second block",fin_crowd.getLatestBlock().hash));
*/

