import { Block } from '../../core/Block';
import { BlockChain } from '../../core/Blockchain';
import { ProofOfWorkService } from '../../core/services/ProofOfWorkService';

const context = describe;

describe('The Blockchain', () => {
	it('includes a genesis block when created from timestamp', () => {
		const blockChain = BlockChain.createFrom(0);
		expect(blockChain.getLastBlock().isGenesis()).toBeTruthy();
	});

	it('creates a blockchain from empty list of blocks is not allowed', () => {
		expect(() => BlockChain.create([])).toThrow();
	});

	it('creates a blockchain with a list of blocks with invalid genesis block is not allowed', () => {
		const noGenesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		(noGenesisBlock as any).previousBlockHash = 'no-genesis';
		expect(() => BlockChain.create([noGenesisBlock])).toThrow();
	});

	it('synchronizes with another blockchain by taking the blockchain with more valid blocks given', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const blockChain = BlockChain.create([genesisBlock]);
		const anotherBlockChain = BlockChain.create([
			genesisBlock,
			Block.createFrom({
				timestamp: 0,
				previousBlockHash: genesisBlock.hash,
				transactions: 'irrelevant-data',
				nonce: 0,
			}),
		]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain);

		expect(blockChainSynchronized).toEqual(anotherBlockChain);
	});

	it('does not synchronize with another blockchain that has less blocks', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const blockChain = BlockChain.create([
			genesisBlock,
			Block.createFrom({
				timestamp: 0,
				previousBlockHash: genesisBlock.hash,
				transactions: 'irrelevant-data',
				nonce: 0,
			}),
		]);
		const anotherBlockChain = BlockChain.create([genesisBlock]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain);

		expect(blockChainSynchronized).toEqual(blockChain);
	});

	it('does not synchronize with another blockchain that has invalid genesis block', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const invalidGenesisBlock = Block.createGenesisFrom({ timestamp: 1, transactions: 'irrelevant-data', nonce: 0 });
		const blockChain = BlockChain.create([genesisBlock]);
		const anotherBlockChain = BlockChain.create([
			invalidGenesisBlock,
			Block.createFrom({
				timestamp: 0,
				previousBlockHash: invalidGenesisBlock.hash,
				transactions: 'irrelevant-data',
				nonce: 0,
			}),
		]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain);

		expect(blockChainSynchronized).toEqual(blockChain);
	});

	it('does not synchronize with another blockchain that has a corrupted block', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const secondBlock = Block.createFrom({
			timestamp: 0,
			previousBlockHash: genesisBlock.hash,
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const blockChain = BlockChain.create([genesisBlock, secondBlock]);
		const corruptedBlock = secondBlock.clone();
		(corruptedBlock as any).transactions = 'corrupted transaction';
		const thirdBlock = Block.createFrom({
			timestamp: 0,
			previousBlockHash: secondBlock.hash,
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const anotherBlockChain = BlockChain.create([genesisBlock, corruptedBlock, thirdBlock]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain);

		expect(blockChainSynchronized).toEqual(blockChain);
	});

	it('does not synchronize with another blockchain that has corrupted previous hash in some block', () => {
		const genesisBlock = Block.createGenesisFrom({ timestamp: 0, transactions: 'irrelevant-data', nonce: 0 });
		const secondBlock = Block.createFrom({
			timestamp: 0,
			previousBlockHash: genesisBlock.hash,
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const blockChain = BlockChain.create([genesisBlock, secondBlock]);
		const blockWithCorruptedPreviousHash = secondBlock.clone();
		(blockWithCorruptedPreviousHash as any).previousBlockHash = 'corrupted previous hash';
		const thirdBlock = Block.createFrom({
			timestamp: 0,
			previousBlockHash: secondBlock.hash,
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const anotherBlockChain = BlockChain.create([genesisBlock, blockWithCorruptedPreviousHash, thirdBlock]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain);

		expect(blockChainSynchronized).toEqual(blockChain);
	});

	context('when difficulty threshold is zero', () => {
		it('concatenates a new block that includes previous hash', () => {
			const blockChain = BlockChain.createFrom(0);
			const block = Block.createFrom({
				timestamp: 0,
				previousBlockHash: blockChain.getLastBlock().hash,
				transactions: 'irrelevant-data',
				nonce: 0,
			});

			const newBlockChain = blockChain.concatBlock(block);

			expect(newBlockChain.getLastBlock().isEquals(block)).toBeTruthy();
		});

		it('does not allow concatenate a block if it does not link to the previous block', () => {
			const blockChain = BlockChain.createFrom(0);
			const unlinkedBlock = blockChain.getLastBlock().clone();
			(unlinkedBlock as any).hash = 'unlinked_hash';
			const block = Block.createFrom({
				timestamp: 0,
				previousBlockHash: unlinkedBlock.hash,
				transactions: 'irrelevant-data',
				nonce: 0,
			});
			expect(() => blockChain.concatBlock(block)).toThrow();
		});
	});

	context('when difficulty threshold is one', () => {
		it('concatenates a new mined block that includes previous hash', () => {
			const difficultyThreshold = 1;
			const blockChain = BlockChain.createFrom(0);
			const candidateBlock = Block.createFrom({
				timestamp: 1,
				previousBlockHash: blockChain.getLastBlock().hash,
				transactions: 'irrelevant-data',
				nonce: 0,
			});
			const minedBlock = ProofOfWorkService.create(difficultyThreshold).mineBlock(candidateBlock);

			expect(blockChain.concatBlock(minedBlock, difficultyThreshold).getLastBlock().isEquals(minedBlock)).toBeTruthy();
		});

		it('does not allow concatenate a candidate block', () => {
			const difficultyThreshold = 1;
			const blockChain = BlockChain.createFrom(0);
			const candidateBlock = Block.createFrom({
				timestamp: 1,
				previousBlockHash: blockChain.getLastBlock().hash,
				transactions: 'irrelevant-data',
				nonce: 0,
			});

			expect(() => blockChain.concatBlock(candidateBlock, difficultyThreshold)).toThrow();
		});
	});
});
