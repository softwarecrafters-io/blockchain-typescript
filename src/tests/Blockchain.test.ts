import { Block } from '../core/Block';
import { BlockChain } from '../core/Blockchain';

describe('The Blockchain', ()=>{
	it('includes a genesis block when created', ()=>{
		const blockChain = BlockChain.create('0');
		expect(blockChain.getLastBlock().isGenesis()).toBeTruthy()
	})
})