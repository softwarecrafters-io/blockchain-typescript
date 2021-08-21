import { Block } from '../core/Block';

describe('The Block', ()=>{
	it('creates a genesis from timestamp and data', ()=>{
		expect(Block.createGenesisFrom('0', 'irrelevant-data').isGenesis()).toBeTruthy()
	})

	it('creates a new block with a valid information', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'irrelevant-data')
		const block = Block.createFrom('0', genesisBlock, 'irrelevant-data');

		expect(block.toString()).toBe('Block - timestamp: 0 previousHash: aacc381f30af91b8c0a5a676e190e296262d0d8d33043a7ff682031ec2aae9c4 currentHash: 8382db6b96b816a1300093f6533efe358a93a52cf4654dca7f071d27d74b4087 data: irrelevant-data')
	})

	it('evaluates if the block has a valid hash', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'irrelevant-data')
		const block = Block.createFrom('0', genesisBlock, 'irrelevant-data');

		expect(block.hasValidHash()).toBeTruthy()
	})

	it('a manipulated block has an invalid hash', ()=>{
		const genesisBlock = Block.createGenesisFrom('0', 'irrelevant-data')
		const manipulatedBlock = Block.createFrom('0', genesisBlock, 'irrelevant-data');
		(manipulatedBlock as any).data = 'manipulated data...';

		expect(manipulatedBlock.hasValidHash()).toBeFalsy()
	})
})