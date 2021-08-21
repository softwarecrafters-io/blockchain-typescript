import { Block } from '../core/Block';
import { BlockChain } from '../core/Blockchain';

describe('The Blockchain', ()=>{
	it('includes a genesis block when created', ()=>{
		const blockChain = BlockChain.create('0');
		expect(blockChain.getLastBlock().isGenesis()).toBeTruthy()
	})
	it('adds a new block that includes previous hash', ()=>{
		const blockChain = BlockChain.create('0');
		const block = Block.createFrom('0', blockChain.getLastBlock().hash, 'irrelevant-data' )

		blockChain.add(block)

		expect(blockChain.getLastBlock().hash).toBe(block.hash)
	})
	it('does not allow adding a block if it does not link to the previous block', ()=>{
		const blockChain = BlockChain.create('0');
		const block = Block.createFrom('0', 'unlinked_hash', 'irrelevant-data' )

		expect(()=>blockChain.add(block)).toThrow('a block with not valid previous hash is not allowed')
	})
})