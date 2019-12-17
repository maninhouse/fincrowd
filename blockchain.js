const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
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
        return new Block(new Date().getTime(), "Genesis Block", "0");
    }
    //取得最新的區塊
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    /*
    //將新區塊上鏈
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        if (this.isValidNewBlock(newBlock, this.getLatestBlock()) &&
            this.isValidBlockStructure(newBlock)){
            newBlock.mine(this.difficulty);
            this.chain.push(newBlock);
        }
    }
    */

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        console.log('\nStarting mining...')
        block.mine(this.difficulty);
        this.chain.push(block);
        //trans上鏈，miner get reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
        console.log('Block successfully mined!')
    }

    createTransaction(transaction){
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
        if (previousBlock.index + 1 !== newBlock.index){
            console.log("invalid index");
            return false;
        }
        else if (previousBlock.hash !== newBlock.previousHash){
            console.log("invalid previoushash");
            return false;
        } 
        else if (newBlock.calculateHash() !== newBlock.hash){
            console.log("invalid hash");
            return false;
        }
        return true;
    }
    //回傳新區塊是否符合格式
    isValidBlockStructure(newBlock){
        return typeof newBlock.index === 'number'
        && typeof newBlock.hash === 'string'
        && typeof newBlock.previousHash === 'string'
        && typeof newBlock.timestamp === 'number'
        && typeof newBlock.data === 'string';
    }
    //驗證鏈是否有效
    isValidChain(blockchain){
        if (!JSON.stringify(blockchain[0]) === JSON.stringify(blockchain.GenesisBlock)){
            return false;
        }
        for (let i = 1; i < blockchain.length; i++){
            if(!this.isValidNewBlock(blockchain[i], blockchain[i-1])){
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



let fincrowdCoin = new Blockchain();

fincrowdCoin.createTransaction(new Transaction('address1','address2',100));
fincrowdCoin.createTransaction(new Transaction('address2', 'address1',50));

fincrowdCoin.minePendingTransactions('lewis');

fincrowdCoin.getBalanceOfAddress('lewis');
//console.log(fincrowdCoin.chain[1].transactions)
/*
console.log("mining block1 ...");
fin_crowd.addBlock(new Block(1,new Date().getTime(),"first block",fin_crowd.getLatestBlock().hash));
console.log("mining block2 ...");
fin_crowd.addBlock(new Block(2,new Date().getTime(),"second block",fin_crowd.getLatestBlock().hash));
*/

