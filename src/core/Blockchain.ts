import { Block } from './Block';

export class BlockChain{
	private constructor(private readonly blocks: ReadonlyArray<Block>) {}

	static create(blocks: ReadonlyArray<Block>){
		if(blocks.length < 1){
			throw 'an empty list of blocks is not allowed';
		}
		if(!blocks[0].isGenesis()){
			throw 'a list without a valid genesis block is not allowed'
		}
		return new BlockChain(blocks)
	}

	static createFrom(timestamp:string){
		return new BlockChain([Block.createGenesisFrom(timestamp, 'genesis block')])
	}

	concatBlock(block:Block){
		if(!block.isEqualsToPreviousHash(this.getLast().hash)){
			throw 'a block with invalid previous hash is not allowed'
		}
		return BlockChain.create(this.blocks.concat(block))
	}

	synchronize(blockChain:BlockChain){

	}

	getLast(){
		return this.blocks[this.blocks.length -1]
	}

	getAll(){
		return this.blocks;
	}
}