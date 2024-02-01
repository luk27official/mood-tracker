import { pbkdf2Sync } from 'crypto';

export function hashPassword(password: string, salt: string): string | null {
    const iterations = 10000;
    const keyLength = 64;
    const hashAlgorithm = 'sha512';

    const pass = pbkdf2Sync(password, salt, iterations, keyLength, hashAlgorithm);
    return pass.toString('hex');
}