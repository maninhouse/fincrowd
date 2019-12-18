const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You can\'t sign transactions for other wallet.');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        
        if(!this.signature || this.signature === 0){
            throw new Error('No signature in this transaction');
        }

        if(this.fromAddress === null) return true;
        
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
        
        return false;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash ){
        this.timestamp = timestamp;
        this.transactions= transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;

    }
    //計算Hash值
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mine(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        //console.log("block mined:" + this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain{
    constructor() {
        this.GenesisBlock = this.createGenesisBlock();
        this.chain = [this.GenesisBlock];
        this.difficulty = 2;
        this.pendingTransactions =[];
        this.miningReward = 100;
    }
    //建立創世區塊
    createGenesisBlock(){
        return new Block(new Date().getTime(), [] , '0');
    }
    //取得最新的區塊
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        //miner get reward
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        
        console.log('\nStarting mining...');
        
        if (this.isValidNewBlock(block, this.getLatestBlock()) &&
            this.isValidBlockStructure(block)){
            block.mine(this.difficulty);
            this.chain.push(block);
            console.log('Block successfully mined!')
        }
        
        this.pendingTransactions = [];
        
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction muct include from and to address');
        }
        if(!transaction.isValid()){
            throw new Error('Transaction is not Valid, it cannot to be added on chain.');
        }
        this.pendingTransactions.push(transaction);
    }

    //this.transactions without pendging?
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        console.log('\nbalance of ' + address.toString() + ' is: ' + balance.toString());
        return balance;
    }

    //回傳新區塊是否有效
    isValidNewBlock(newBlock, previousBlock){
        if (previousBlock.hash !== newBlock.previousHash){
            console.log("invalid previoushash");
            return false;
        } 
        return true;
    }
    //回傳新區塊是否符合格式
    isValidBlockStructure(newBlock){
        return typeof newBlock.hash === 'string'
        && typeof newBlock.previousHash === 'string'
        && typeof newBlock.timestamp === 'number';
    }
    //驗證鏈是否有效
    isValidChain(){
        let blockchain = this.chain;
        //驗證創世區塊
        if (!JSON.stringify(blockchain[0]) === JSON.stringify(blockchain.GenesisBlock)){
            return false;
        }
        //驗證區塊、transaction是否有效
        for (let i = 1; i < blockchain.length; i++){
            if(!this.isValidNewBlock(blockchain[i], blockchain[i-1])){
                return false;
            }
            if(!blockchain[i].hasValidTransactions()){
                return false;
            }
        }
        return true;
    }

    hashMatchesDifficulty(hash, difficulty){
        hashInBinary = hexToBinary(hash);
        requiredPrefix = '0'.repeat(difficulty);
        return hashInBinary.startsWith(requiredPrefix);
    }

    
}


module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;