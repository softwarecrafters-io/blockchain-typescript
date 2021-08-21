import { Block } from '../core/Block';
import { BlockChain } from '../core/Blockchain';

const context = describe;

describe('The Blockchain', ()=>{
	it('includes a genesis block when created from timestamp', ()=>{
		const blockChain = BlockChain.createFrom('0');
		expect(blockChain.getLastBlock().isGenesis()).toBeTruthy()
	})

	it('creates a blockchain from empty list of blocks is not allowed', ()=>{
		expect(()=> BlockChain.create([])).toThrow()
	})

	it('creates a blockchain with a list of blocks with invalid genesis block is not allowed', ()=>{
		expect(()=> BlockChain.create([Block.createFrom('0', 'no-genesis', 'irrelevant-data')])).toThrow()
	})

	it('concatenates a new block that includes previous hash', ()=>{
		const blockChain = BlockChain.createFrom('0');
		const block = Block.createFrom('0', blockChain.getLastBlock().hash, 'irrelevant-data' )

		const newBlockChain = blockChain.concatBlock(block)

		expect(newBlockChain.getLastBlock().hash).toBe(block.hash)
	})

	it('does not allow adding a block if it does not link to the previous block', ()=>{
		const blockChain = BlockChain.createFrom('0');
		const block = Block.createFrom('0', 'unlinked_hash', 'irrelevant-data' )
		expect(()=>blockChain.concatBlock(block)).toThrow()
	});

	it('synchronizes with another blockchain by taking the blockchain with more valid blocks given', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'data');
		const blockChain = BlockChain.create([genesisBlock]);
		const anotherBlockChain = BlockChain.create([genesisBlock, Block.createFrom('1', genesisBlock.hash, 'more data')]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain)

		expect(blockChainSynchronized).toEqual(anotherBlockChain)
	})

	it('does not synchronize with another blockchain that has less blocks', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'data');
		const blockChain = BlockChain.create([genesisBlock, Block.createFrom('1', genesisBlock.hash, 'more data')]);
		const anotherBlockChain = BlockChain.create([genesisBlock]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain)

		expect(blockChainSynchronized).toEqual(blockChain)
	})
})