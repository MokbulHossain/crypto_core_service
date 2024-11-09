import * as crypto from 'crypto';

const password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY'
const iv = '60iP0h6vJoEa';

export function encrypt(text: string): { content: string; tag: string } {
	const cipher = crypto.createCipheriv('aes-256-gcm', password, iv);
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	const tag = cipher.getAuthTag();
	return {
		content: encrypted,
		tag: tag.toString('hex'),
	};
}

// export function decrypt(encrypted: { tag: string; content: string }): string {
export function decrypt(encryptedData): string {

	try {
		let encrypted :{ tag: string; content: string }= JSON.parse(encryptedData)
		const decipher = crypto.createDecipheriv('aes-256-gcm', password, iv);
		decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));
		let dec = decipher.update(encrypted.content, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	} catch(e) {
		console.log(e)
		return encryptedData
	}
}
