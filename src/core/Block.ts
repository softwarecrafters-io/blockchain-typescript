import { CryptoUtils } from './CrytoUtils';

export type BlockProperties = {
	timestamp: number;
	previousBlockHash: string;
	hash: string;
	transactions: any;
	nonce: number;
	difficulty?: number;
};

export type NewBlockProperties = Omit<BlockProperties, 'hash'>;

export type NewGenesisBlockProperties = Omit<NewBlockProperties, 'previousBlockHash'>;

export type NewBlockFromCandidateProperties = {
	candidateBlock: Block;
	timestamp: number;
	nonce: number;
	difficulty: number;
};

export class Block {
	readonly timestamp: number;
	private readonly previousBlockHash: string;
	readonly hash: string;
	private readonly transactions: any;
	private readonly nonce: number;
	readonly difficulty: number;

	private constructor(properties: BlockProperties) {
		this.timestamp = properties.timestamp;
		this.previousBlockHash = properties.previousBlockHash;
		this.hash = properties.hash;
		this.transactions = properties.transactions;
		this.nonce = properties.nonce;
		this.difficulty = properties.difficulty ? properties.difficulty : 0;
	}

	static createFrom(properties: NewBlockProperties) {
		const hash = Block.generateHash({ ...properties });
		return new Block({ hash, ...properties });
	}

	static createGenesisFrom(properties: NewGenesisBlockProperties) {
		const previousBlockHash = '';
		const hash = Block.generateHash({ previousBlockHash, ...properties });
		return new Block({ previousBlockHash, hash, ...properties });
	}

	static createFromCandidate(properties: NewBlockFromCandidateProperties) {
		const { nonce, timestamp } = properties;
		const { previousBlockHash, transactions, difficulty } = properties.candidateBlock;
		const hash = Block.generateHash({ nonce, timestamp, previousBlockHash, transactions });
		return new Block({ hash, nonce, timestamp, previousBlockHash, transactions, difficulty });
	}

	private static generateHash(properties: NewBlockProperties) {
		const { timestamp, previousBlockHash, transactions, nonce } = properties;
		return CryptoUtils.generateHashSHA256(timestamp, previousBlockHash, transactions, nonce);
	}

	hasValidHash(difficultyThreshold = 0) {
		return this.isValidHashBasedOnDifficultyThreshold(difficultyThreshold) && this.isUnmanipulatedHash();
	}

	private isUnmanipulatedHash() {
		const { timestamp, previousBlockHash, transactions, nonce } = this;
		const validHash = Block.generateHash({ timestamp, previousBlockHash, transactions, nonce }).toString();
		return this.hash === validHash;
	}

	private isValidHashBasedOnDifficultyThreshold(difficultyThreshold: number) {
		if (difficultyThreshold === 0) {
			return true;
		}
		const beginningOfHash = this.hash.substring(0, difficultyThreshold);
		const patternAdjustedToDifficulty = '0'.repeat(difficultyThreshold);
		return beginningOfHash === patternAdjustedToDifficulty;
	}

	isGenesis() {
		return !this.previousBlockHash;
	}

	isPreviousBlock(block) {
		return block.hash === this.previousBlockHash;
	}

	isEquals(block: Block) {
		return this.toString() === block.toString();
	}

	clone() {
		const { timestamp, previousBlockHash, transactions, nonce, hash } = this;
		return new Block({ timestamp, previousBlockHash, transactions, nonce, hash });
	}

	toString() {
		return `Block 
				timestamp: ${this.timestamp} 
				nonce: ${this.nonce} 
				previousHash: ${this.previousBlockHash} 
				currentHash: ${this.hash} 
				transactions: ${this.transactions}
				difficulty: ${this.difficulty}`;
	}
}
