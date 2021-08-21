import { Block } from './Block';

export class BlockChain{
	constructor(private readonly blocks: ReadonlyArray<Block>) {}

	static create(timestamp:string){
		return new BlockChain([Block.createGenesisFrom(timestamp, 'genesis block')])
	}

	getLastBlock(){
		return this.blocks[this.blocks.length -1]
	}
}