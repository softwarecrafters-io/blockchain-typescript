import { SHA256 } from 'crypto-js';
import { v4 } from 'uuid';

export class HashGeneratorService {
	static generateSHA256(...args): string {
		const argumentsToString = args.map((v) => v.toString()).reduce((p, c) => p.concat(c), '');
		return SHA256(argumentsToString).toString();
	}

	static generateUniqueIdentifier(): string {
		const uuid = v4();
		return uuid;
	}
}
