import { Block } from './Block';

export class BlockChain{
	constructor(private blocks: ReadonlyArray<Block>) {}

	static create(timestamp:string){
		return new BlockChain([Block.createGenesisFrom(timestamp, 'genesis block')])
	}

	add(block:Block){
		if(!block.isEqualsToPreviousHash(this.getLastBlock().hash)){
			throw 'a block with not valid previous hash is not allowed'
		}
		this.blocks = this.blocks.concat(block)
	}

	getLastBlock(){
		return this.blocks[this.blocks.length -1]
	}
}