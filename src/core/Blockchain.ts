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

	static createFromAnother(blockChain: BlockChain){
		return new BlockChain(blockChain.blocks)
	}

	concatBlock(block:Block){
		if(!block.isPreviousBlock(this.getLastBlock())){
			throw 'a block with invalid previous hash is not allowed'
		}
		return BlockChain.create(this.blocks.concat(block))
	}

	synchronize(blockChain:BlockChain){
		const shallKeepCurrent = this.length() >= blockChain.length() || !this.hasIntegrity(blockChain)
		if (shallKeepCurrent) {
			return BlockChain.createFromAnother(this);
		}
		return BlockChain.createFromAnother(blockChain);
	}

	private hasIntegrity(blockChain:BlockChain){
		const hasEqualsGenesisBlock = this.getGenesisBlock().isEquals(blockChain.getGenesisBlock())
		const containsAllBlocksWithValidHash = blockChain.blocks
			.map(block => block.hasValidHash())
			.reduce((previous, current) => previous && current, true);
		const containsAllBlocksWithValidPreviousHash = blockChain.getBlocksWithoutGenesis()
			.map((block, index) => block.isPreviousBlock(blockChain.blocks[index]))

		return hasEqualsGenesisBlock && containsAllBlocksWithValidHash
	}

	getGenesisBlock(){
		return this.blocks[0]
	}

	getLastBlock(){
		return this.blocks[this.blocks.length -1]
	}

	getBlocksWithoutGenesis(){
		const [_, ...remainBlocks] = this.blocks;
		return remainBlocks;
	}

	getAllBlocks(){
		return this.blocks;
	}

	length(){
		return this.blocks.length;
	}
}