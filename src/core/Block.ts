export type BlockProperties ={
	timestamp:string,
	previousHash: string,
	currentHash: string,
	data: any
}

export class Block{
	private readonly timestamp:string;
	private readonly previousHash: string;
	private readonly currentHash: string;
	private readonly data: any;

	private constructor(properties: BlockProperties) {
		this.timestamp = properties.timestamp
		this.previousHash = properties.previousHash
		this.currentHash = properties.currentHash
		this.data = properties.data
	}

	static mine(timestamp:string, previousHash: string, data:any){
		const currentHash = Block.generateHash(timestamp, previousHash, data)
		return new Block({ timestamp, previousHash, currentHash, data })
	}

	static createGenesis(timestamp:string, data:any){
		const previousHash = '';
		const currentHash = Block.generateHash(timestamp, previousHash, data)
		return new Block({ timestamp, previousHash, currentHash, data })
	}

	private static generateHash(timestamp:string, previousHash: string, data:any){
		return 'hash...'
	}

	isGenesis(){
		return this.previousHash === '';
	}

	toString(){
		return `Block - 
			timestamp: ${this.timestamp}
			previousHash: ${this.previousHash}
			currentHash: ${this.currentHash}
			data: ${this.data}`
	}

}