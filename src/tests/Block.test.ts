import { Block } from '../core/Block';

describe('The Block', ()=>{
	it('creates a genesis from timestamp and data', ()=>{
		expect(Block.createGenesisFrom('0', 'irrelevant-data').isGenesis()).toBeTruthy()
	})

	it('creates a new block with a valid SHA256 hash', ()=>{
		const block = Block.createFrom('0', 'irrelevant-hash', 'irrelevant-data');

		expect(block.hash.length).toBe(64)
		expect(block.hash).toBe('14ade5300710bd577b067446b496bd1abea6af5529a994a39e3403172a46d6f9')
	})

	it('creates a new block with a valid information', ()=>{
		const block = Block.createFrom('0', 'irrelevant-hash', 'irrelevant-data');

		expect(block.toString()).toBe('Block - timestamp: 0 previousHash: irrelevant-hash currentHash: 14ade5300710bd577b067446b496bd1abea6af5529a994a39e3403172a46d6f9 data: irrelevant-data')
	})

	it('evaluates if the block has a valid hash', ()=>{
		const block = Block.createFrom('0', 'irrelevant-hash', 'irrelevant-data');

		expect(block.hasValidHash()).toBeTruthy()
	})

	it('a manipulated block has an invalid hash', ()=>{
		const manipulatedBlock = Block.createFrom('0', 'irrelevant-hash', 'irrelevant-data');
		(manipulatedBlock as any).data = 'manipulated data...';

		expect(manipulatedBlock.hasValidHash()).toBeFalsy()
	})
})