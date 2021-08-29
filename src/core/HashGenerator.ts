import { SHA256 } from 'crypto-js';

export class HashGenerator {
	static generateSHA256(...args) {
		const argumentsToString = args.map((v) => v.toString()).reduce((p, c) => p.concat(c), '');
		return SHA256(argumentsToString).toString();
	}
}
