import * as forge from 'node-forge';
import { environment } from '@environments/environment';

export class SrpEncryption{

    encryptText(textPlain: string): string {
        return this.encryptKey(textPlain, environment.PUBLIC_KEY_BACKEND);
    }

    private encryptKey(textPlain: string, pem: string): string {
        const publicKey = forge.pki.publicKeyFromPem(pem) as forge.pki.rsa.PublicKey;
        const buffer = forge.util.createBuffer(textPlain, 'utf8');
        const bytes = buffer.getBytes();
        const encrypted = publicKey.encrypt(bytes, 'RSA-OAEP',{
            md: forge.md.sha256.create()
        });
        return forge.util.encode64(encrypted);
    }
}