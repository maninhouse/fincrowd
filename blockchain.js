const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    //計算Hash值
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

}

class Blockchain{
    constructor() {
        this.GenesisBlock = this.createGenesisBlock();
        this.chain = [this.GenesisBlock];
    }
    //建立創世區塊
    createGenesisBlock(){
        return new Block(0, new Date().getTime(), "Genesis Block", "0");
    }
    //取得最新的區塊
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    //將新區塊上鏈
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        if (this.isValidNewBlock(newBlock, this.getLatestBlock()) &&
            this.isValidBlockStructure(newBlock)){
            this.chain.push(newBlock);
        }
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

    
}

let fin_crowd = new Blockchain();
//console.log(fin_crowd.getLatestBlock());
fin_crowd.addBlock(new Block(1,new Date().getTime(),"first block",fin_crowd.getLatestBlock().hash));

//console.log(fin_crowd.isValidChain(fin_crowd.chain));
