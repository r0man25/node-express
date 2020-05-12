const crypto = require('crypto');
const {crypto: cryptoConfig} = require('../config/app');

/**
 * Class to help in work with arrays
 */
class Crypto {

    // Base crypto
    static crypto = crypto

    // Defining algorithm
    static algorithm = 'aes-256-cbc'

    // Defining key
    static key = cryptoConfig.key

    // Defining iv
    static iv = crypto.randomBytes(16)

    static encrypt(text) {
        // Creating Cipheriv with its parameter
        let cipher = crypto.createCipheriv(Crypto.algorithm, /*Buffer.from(Crypto.key)*/Crypto.key, Crypto.iv);

        // Updating text
        let encrypted = cipher.update(text);

        // Using concatenation
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // Returning iv and encrypted data
        return { iv: Crypto.iv.toString('hex'),
            encryptedData: encrypted.toString('hex') };
    }

    static decrypt(text) {
        let iv = Buffer.from(text.iv, 'hex');
        let encryptedText = Buffer.from(text.encryptedData, 'hex');

        // Creating Decipher
        let decipher = crypto.createDecipheriv(Crypto.algorithm, /*Buffer.from(Crypto.key)*/Crypto.key, iv);
        // decipher.setAutoPadding(false); // !!!!!!!!!add this line!!!!!!!!!!
        // Updating encrypted text
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }

}

module.exports = Crypto;