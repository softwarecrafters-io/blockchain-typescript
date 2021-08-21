import { Block } from '../core/Block';

describe('The Block', ()=>{
	it('creates a genesis from timestamp and data', ()=>{
		expect(Block.createGenesis('0', 'irrelevant-data').isGenesis()).toBeTruthy()
	})
})