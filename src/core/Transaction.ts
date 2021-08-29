import { HashGeneratorService } from './services/HashGeneratorService';

export class Transaction {
	private constructor(public readonly id: string) {}

	static create() {
		const id = HashGeneratorService.generateUniqueIdentifier();
		return new Transaction(id);
	}
}
