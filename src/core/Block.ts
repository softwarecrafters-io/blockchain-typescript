import {SHA256} from 'crypto-js'

export type BlockProperties ={
	timestamp:string,
	previousBlockHash: string,
	hash: string,
	data: any
}

export class Block{
	private readonly timestamp:string;
	private readonly previousBlockHash: string;
	readonly hash: string;
	private readonly data: any;

	private constructor(properties: BlockProperties) {
		this.timestamp = properties.timestamp
		this.previousBlockHash = properties.previousBlockHash
		this.hash = properties.hash
		this.data = properties.data
	}

	static createFrom(timestamp:string, previousHash: string, data:any){
		const currentHash = Block.generateHash(timestamp, previousHash, data)
		return new Block({ timestamp, previousBlockHash: previousHash, hash: currentHash, data })
	}

	static createGenesisFrom(timestamp:string, data:any){
		const previousHash = '';
		const currentHash = Block.generateHash(timestamp, previousHash, data)
		return new Block({ timestamp, previousBlockHash: previousHash, hash: currentHash, data })
	}

	private static generateHash(timestamp:string, previousHash: string, data:any){
		return SHA256(`${timestamp}${previousHash}${data}`).toString()
	}

	hasValidHash(){
		const validHash = Block.generateHash(this.timestamp, this.previousBlockHash, this.data).toString()
		return this.hash === validHash;
	}

	isGenesis(){
		return !this.previousBlockHash;
	}

	isEqualsToPreviousHash(hash:string){
		return this.previousBlockHash === hash
	}

	isEquals(block:Block){
		return this.toString() === block.toString()
	}

	toString(){
		return `Block - timestamp: ${this.timestamp} previousHash: ${this.previousBlockHash} currentHash: ${this.hash} data: ${this.data}`
	}
}