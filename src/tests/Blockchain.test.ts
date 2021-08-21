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
		const noGenesisBlock = Block.createGenesisFrom('0', 'irrelevant-data');
		(noGenesisBlock as any).previousBlockHash = 'no-genesis'
		expect(()=> BlockChain.create([noGenesisBlock])).toThrow()
	})

	it('concatenates a new block that includes previous hash', ()=>{
		const blockChain = BlockChain.createFrom('0');
		const block = Block.createFrom('0', blockChain.getLastBlock(), 'irrelevant-data' )

		const newBlockChain = blockChain.concatBlock(block)

		expect(newBlockChain.getLastBlock().isEquals(block)).toBeTruthy()
	})

	it('does not allow adding a block if it does not link to the previous block', ()=>{
		const blockChain = BlockChain.createFrom('0');
		const unlinkedBlock = blockChain.getLastBlock().clone();
		(unlinkedBlock as any).hash = 'unlinked_hash';
		const block = Block.createFrom('0', unlinkedBlock, 'irrelevant-data' )
		expect(()=>blockChain.concatBlock(block)).toThrow()
	});

	it('synchronizes with another blockchain by taking the blockchain with more valid blocks given', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'data');
		const blockChain = BlockChain.create([genesisBlock]);
		const anotherBlockChain = BlockChain.create([genesisBlock, Block.createFrom('1', genesisBlock, 'more data')]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain)

		expect(blockChainSynchronized).toEqual(anotherBlockChain)
	})

	it('does not synchronize with another blockchain that has less blocks', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'data');
		const blockChain = BlockChain.create([genesisBlock, Block.createFrom('1', genesisBlock, 'more data')]);
		const anotherBlockChain = BlockChain.create([genesisBlock]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain)

		expect(blockChainSynchronized).toEqual(blockChain)
	})

	it('does not synchronize with another blockchain that has invalid genesis block', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'data');
		const invalidGenesisBlock = Block.createGenesisFrom('1', 'data');
		const blockChain = BlockChain.create([genesisBlock]);
		const anotherBlockChain = BlockChain.create([invalidGenesisBlock, Block.createFrom('1', invalidGenesisBlock, 'more data')]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain)

		expect(blockChainSynchronized).toEqual(blockChain)
	})

	it('does not synchronize with another blockchain that has a manipulated block', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'data');
		const secondBlock = Block.createFrom('1', genesisBlock, 'more data');
		const blockChain = BlockChain.create([genesisBlock, secondBlock]);
		const manipulatedBlock = secondBlock.clone();
		(manipulatedBlock as any).data = 'manipulated data';
		const thirdBlock = Block.createFrom('1', secondBlock, 'more data...');
		const anotherBlockChain = BlockChain.create([genesisBlock, manipulatedBlock, thirdBlock]);

		const blockChainSynchronized = blockChain.synchronize(anotherBlockChain)

		expect(blockChainSynchronized).toEqual(blockChain)
	})
})