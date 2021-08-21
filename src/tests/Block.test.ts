import { Block } from '../core/Block';

describe('The Block', ()=>{
	it('creates a genesis from timestamp and data', ()=>{
		expect(Block.createGenesisFrom('0', 'irrelevant-data').isGenesis()).toBeTruthy()
	})
	it('creates a new block with a valid SHA256 hash', ()=>{
		const block = Block.createFrom('0', 'irrelevant-hash', 'irrelevant-data');

		expect(block.hash.length).toBe(64)
		expect(block.hash).toBe('5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9')
	})
	it('creates a new block with a valid information', ()=>{
		const block = Block.createFrom('0', 'irrelevant-hash', 'irrelevant-data');

		expect(block.toString()).toBe('Block - timestamp: 0 previousHash: irrelevant-hash currentHash: 5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9 data: irrelevant-data')
	})
})