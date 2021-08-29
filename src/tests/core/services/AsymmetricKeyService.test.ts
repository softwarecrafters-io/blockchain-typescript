import { AsymmetricKeyService } from '../../../core/services/AsymmetricKeyService';

describe('The asymmetric key service', () => {
	it('generates a key pair in hexadecimal format', () => {
		const keyPair = AsymmetricKeyService.generateKeyPair();

		expect(keyPair.privateKey.length).toBe(64);
		expect(keyPair.publicKey.length).toBe(130);
	});

	it('signs a hash using a given private key', () => {
		const { privateKey } = AsymmetricKeyService.generateKeyPair();

		const signature = AsymmetricKeyService.signHash(privateKey, 'irrelevant-hash');

		expect(signature).toBeInstanceOf(Array);
	});

	it('verifies a signature for a particular hash using a given public key', () => {
		const hash = 'hash';
		const { publicKey, privateKey } = AsymmetricKeyService.generateKeyPair();
		const signature = AsymmetricKeyService.signHash(privateKey, 'hash');

		const result = AsymmetricKeyService.verifySignature(publicKey, signature, hash);

		expect(result).toBeTruthy();
	});
});
