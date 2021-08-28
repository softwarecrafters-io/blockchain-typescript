import { Block } from './Block';

export class BlockChain {
	private constructor(private blocks: ReadonlyArray<Block>) {}

	static create(blocks: ReadonlyArray<Block>) {
		if (blocks.length < 1) {
			throw 'an empty blockchain is not allowed';
		}
		if (!blocks[0].isGenesis()) {
			throw 'a blockchain without a valid genesis block is not allowed';
		}
		return new BlockChain(blocks);
	}

	static createFrom(timestamp: number) {
		return BlockChain.create([
			Block.createGenesisFrom({ timestamp: timestamp, transactions: 'irrelevant-data', nonce: 0 }),
		]);
	}

	static createFromAnother(blockChain: BlockChain) {
		return BlockChain.create(blockChain.blocks);
	}

	concatBlock(block: Block, difficultyThreshold = 0) {
		if (!block.isPreviousBlock(this.getLastBlock())) {
			throw 'a block with invalid previous hash is not allowed';
		}
		if (!block.hasValidHash(difficultyThreshold)) {
			throw 'a block with invalid hash is not allowed';
		}
		return (this.blocks = this.blocks.concat(block));
	}

	synchronize(blockChain: BlockChain) {
		const shallKeepCurrentBlocks = this.length() >= blockChain.length() || !this.hasIntegrity(blockChain);
		if (!shallKeepCurrentBlocks) {
			this.blocks = blockChain.blocks;
		}
	}

	private hasIntegrity(blockChain: BlockChain) {
		const hasEqualsGenesisBlock = this.getGenesisBlock().isEquals(blockChain.getGenesisBlock());
		const containsAllBlocksWithValidHash = blockChain.blocks
			.map((block) => block.hasValidHash())
			.reduce((previous, current) => previous && current, true);
		const containsAllBlocksAreConnectedToPrevious = blockChain
			.getBlocksWithoutGenesis()
			.map((block, index) => block.isPreviousBlock(blockChain.blocks[index]))
			.reduce((previous, current) => previous && current, true);
		return hasEqualsGenesisBlock && containsAllBlocksWithValidHash && containsAllBlocksAreConnectedToPrevious;
	}

	getGenesisBlock() {
		return this.blocks[0];
	}

	getLastBlock() {
		return this.blocks[this.blocks.length - 1];
	}

	getLastBlocks(n: number) {
		return this.blocks.slice(-n);
	}

	getBlocksWithoutGenesis() {
		const [_, ...remainBlocks] = this.blocks;
		return remainBlocks;
	}

	getAllBlocks() {
		return this.blocks;
	}

	length() {
		return this.blocks.length;
	}
}
