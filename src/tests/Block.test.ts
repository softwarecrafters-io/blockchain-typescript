import { Block } from '../core/Block';

describe('The Block', ()=>{
	it('creates a genesis from timestamp and data', ()=>{
		expect(Block.createGenesisFrom('0', 'irrelevant-data').isGenesis()).toBeTruthy()
	})
	it('creates a new block with a valid hash', ()=>{
		const block = Block.createFrom('0', '', 'irrelevant-data');

		expect(block.hash).toBe('5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9')
	})
})