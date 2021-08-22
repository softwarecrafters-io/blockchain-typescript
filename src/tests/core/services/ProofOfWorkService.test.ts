import { ProofOfWorkService } from '../../../core/services/ProofOfWorkService';
import { Block } from '../../../core/Block';

describe('The proof of work service', ()=>{
	it('does not allow negative difficulty threshold', ()=>{
		expect(()=>ProofOfWorkService.create(-1)).toThrow()
	})

	it('mines a candidate block with a difficulty threshold of one', ()=>{
		const block = Block.createFrom({timestamp:'0', previousBlockHash: 'irrelevant-hash', transactions:'irrelevant-data', nonce:0});
		const proofOfWorkService = ProofOfWorkService.create(1);

		const minedBlock = proofOfWorkService.mineBlock(block)
		expect(minedBlock.hash.substring(0,1)).toBe('0')
	})

	it('mines a candidate block with a difficulty threshold of two', ()=>{
		const block = Block.createFrom({timestamp:'0', previousBlockHash: 'irrelevant-hash', transactions:'irrelevant-data', nonce:0});
		const proofOfWorkService = ProofOfWorkService.create(2);

		const minedBlock = proofOfWorkService.mineBlock(block)
		expect(minedBlock.hash.substring(0,2)).toBe('00')
	})

	it('mines a candidate block with a difficulty threshold of three', ()=>{
		const block = Block.createFrom({timestamp:'0', previousBlockHash: 'irrelevant-hash', transactions:'irrelevant-data', nonce:0});
		const proofOfWorkService = ProofOfWorkService.create(3);
		console.time('mining')
		const minedBlock = proofOfWorkService.mineBlock(block)
		console.timeEnd('mining')
		expect(minedBlock.hash.substring(0,3)).toBe('000')
	});
})