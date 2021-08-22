import { ProofOfWorkService } from '../../../core/services/ProofOfWorkService';

describe('The proof of work service', ()=>{
	it('does not allow negative difficulty threshold', ()=>{
		expect(()=>ProofOfWorkService.create(-1)).toThrow()
	})
})