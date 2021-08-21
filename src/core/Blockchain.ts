import { Block } from './Block';

export class BlockChain{
	constructor(private blocks: ReadonlyArray<Block>) {}

	static create(timestamp:string){
		return new BlockChain([Block.createGenesisFrom(timestamp, 'genesis block')])
	}

	add(block:Block){
		this.blocks = this.blocks.concat(block)
	}

	getLastBlock(){
		return this.blocks[this.blocks.length -1]
	}
}