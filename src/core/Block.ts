import {SHA256} from 'crypto-js'

export type BlockProperties ={
	timestamp:string,
	previousBlockHash: string,
	hash: string,
	transactions: any,
	nonce:number
}

export type NewBlockProperties = Omit<BlockProperties, 'hash'>

export type NewGenesisBlockProperties = Omit<NewBlockProperties, 'previousBlockHash'>

export class Block{
	private readonly timestamp:string;
	private readonly previousBlockHash: string;
	readonly hash: string;
	private readonly transactions: any;
	private readonly nonce: number;

	private constructor(properties: BlockProperties) {
		this.timestamp = properties.timestamp
		this.previousBlockHash = properties.previousBlockHash
		this.hash = properties.hash
		this.transactions = properties.transactions
		this.nonce = properties.nonce;
	}

	static createFrom(properties: NewBlockProperties){
		const hash = Block.generateHash({...properties})
		return new Block({ hash, ...properties})
	}

	static createGenesisFrom(properties: NewGenesisBlockProperties){
		const previousBlockHash = '';
		const hash = Block.generateHash({ previousBlockHash, ...properties })
		return new Block({ previousBlockHash, hash, ...properties })
	}

	private static generateHash(properties: NewBlockProperties){
		const {timestamp, previousBlockHash, transactions, nonce} = properties;
		return SHA256(`${timestamp}${previousBlockHash}${transactions}${nonce}`).toString()
	}

	hasValidHash(){
		const {timestamp, previousBlockHash, transactions, nonce} = this;
		const validHash = Block.generateHash( {timestamp, previousBlockHash, transactions, nonce}).toString()
		return this.hash === validHash;
	}

	isGenesis(){
		return !this.previousBlockHash;
	}

	isPreviousBlock(block){
		return block.hash === this.previousBlockHash;
	}

	isEquals(block:Block){
		return this.toString() === block.toString()
	}

	toString(){
		return `Block - timestamp: ${this.timestamp} nonce: ${this.nonce} previousHash: ${this.previousBlockHash} currentHash: ${this.hash} transactions: ${this.transactions}`
	}

	clone(){
		const {timestamp, previousBlockHash, transactions, nonce, hash} = this;
		return new Block({timestamp, previousBlockHash, transactions, nonce, hash})
	}
}