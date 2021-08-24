import { Block } from '../../core/Block';

describe('The Block', () => {
	it('creates a genesis from timestamp and data', () => {
		expect(
			Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 }).isGenesis()
		).toBeTruthy();
	});

	it('creates a new block with a valid SHA256 hash', () => {
		const block = Block.createFrom({
			timestamp: 0,
			previousBlockHash: 'irrelevant-hash',
			transactions: 'irrelevant-data',
			nonce: 0,
		});

		expect(block.hash.length).toBe(64);
		expect(block.hash).toBe('fbd10fb55e2f0402bf422925252e9a8cbf45a76b825a1a8c589f77f1bf39f028');
	});

	it('creates a new block with a valid information', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const block = Block.createFrom({
			timestamp: 0,
			previousBlockHash: genesisBlock.hash,
			transactions: 'irrelevant-data',
			nonce: 0,
		});

		expect(block.toString()).toBe(`Block 
				timestamp: 0 
				nonce: 0 
				previousHash: 2070ec51d846b3c298ff989abc31c6cded5be390763263441ddf2c67597ba829 
				currentHash: 07adbffb5d6253b942baa6021a13e4f3026e999f3a9f4aa325adf7eab8107cb5 
				transactions: irrelevant-data
				difficulty: 0`);
	});

	it('evaluates if the block has a valid hash', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const block = Block.createFrom({
			timestamp: 0,
			previousBlockHash: genesisBlock.hash,
			transactions: 'irrelevant-data',
			nonce: 0,
		});

		expect(block.hasValidHash()).toBeTruthy();
	});

	it('a manipulated block has an invalid hash', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const manipulatedBlock = Block.createFrom({
			timestamp: 0,
			previousBlockHash: genesisBlock.hash,
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		(manipulatedBlock as any).transactions = 'manipulated transactions...';

		expect(manipulatedBlock.hasValidHash()).toBeFalsy();
	});
});
