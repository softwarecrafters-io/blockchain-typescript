import { Block } from '../core/Block';
import { BlockChain } from '../core/Blockchain';

describe('The Blockchain', ()=>{
	it('includes a genesis block when created from timestamp', ()=>{
		const blockChain = BlockChain.createFrom('0');
		expect(blockChain.getLast().isGenesis()).toBeTruthy()
	})
	it('creates a blockchain from empty list of blocks is not allowed', ()=>{
		expect(()=> BlockChain.create([])).toThrow()
	})
	it('concatenates a new block that includes previous hash', ()=>{
		const blockChain = BlockChain.createFrom('0');
		const block = Block.createFrom('0', blockChain.getLast().hash, 'irrelevant-data' )

		const newBlockChain = blockChain.concatBlock(block)

		expect(newBlockChain.getLast().hash).toBe(block.hash)
	})
	it('does not allow adding a block if it does not link to the previous block', ()=>{
		const blockChain = BlockChain.createFrom('0');
		const block = Block.createFrom('0', 'unlinked_hash', 'irrelevant-data' )

		expect(()=>blockChain.concatBlock(block)).toThrow('a block with not valid previous hash is not allowed')
	})
})