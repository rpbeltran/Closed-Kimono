#include "cryptoshit.h"

#include <openssl/rand.h>
#include <openssl/conf.h>
#include <openssl/evp.h>
#include <openssl/err.h>

#include <stdint.h>
#include <string.h>

#pragma mark potat
#define EXPORT __attribute__((visibility("default")))

// tbh this can only ever be 16 but fuck the police
#define IV_LENGTH 16

#pragma mark more helper shits
/**
 * generates an iv through MAGIC. this does literally no bounds checking so fuck
 * you if it breaks lol
 */
static void generateIv(void *buf) {
	int status = -1;

	// LOL the IV is 16 bytes
	status = RAND_bytes((unsigned char *) buf, IV_LENGTH);

	// check for error?
	if(status != 1) {
		printf("something wrong with generate IV !!!!!! (%li)\n", ERR_get_error());
		abort();
	}
}
 
/**
 * secrete OpenSSL errors
 */
static void secreteLibSSLError(void) {
	ERR_print_errors_fp(stderr);
	abort();
}

static int encrypt(void *plaintext, size_t plaintext_len, void *key, void *iv, void *ciphertext) {
	EVP_CIPHER_CTX *ctx;

	int len;
	int ciphertext_len;

	// initialize the CryptoExcreter
	if(!(ctx = EVP_CIPHER_CTX_new())) {
		secreteLibSSLError();
	}

	/* Initialise the encryption operation. IMPORTANT - ensure you use a key
	* and IV size appropriate for your cipher
	* In this example we are using 256 bit AES (i.e. a 256 bit key). The
	* IV size for *most* modes is the same as the block size. For AES this
	* is 128 bits */
	if(1 != EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv)) {
		secreteLibSSLError();
	}

	// encrypt pls
	if(1 != EVP_EncryptUpdate(ctx, ciphertext, &len, plaintext, plaintext_len)) {
		secreteLibSSLError();
	}

	ciphertext_len = len;

	// finalize
	if(1 != EVP_EncryptFinal_ex(ctx, ciphertext + len, &len)) {
		secreteLibSSLError();
	}

	ciphertext_len += len;

	// Clean up
	EVP_CIPHER_CTX_free(ctx);

	return ciphertext_len;
}

static int decrypt(void *ciphertext, size_t ciphertext_len, void *key, void *iv, void *plaintext) {
	EVP_CIPHER_CTX *ctx;

	int len;
	int plaintext_len;

	// initialize the CryptoExcreter
	if(!(ctx = EVP_CIPHER_CTX_new())) {
		secreteLibSSLError();
	}

	/* Initialise the decryption operation. IMPORTANT - ensure you use a key
	* and IV size appropriate for your cipher
	* In this example we are using 256 bit AES (i.e. a 256 bit key). The
	* IV size for *most* modes is the same as the block size. For AES this
	* is 128 bits */
	if(1 != EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv)) {
		secreteLibSSLError();
	}

	// Run the decryptificator again
	if(1 != EVP_DecryptUpdate(ctx, plaintext, &len, ciphertext, ciphertext_len)) {
		secreteLibSSLError();
	}
	plaintext_len = len;

	// finish up secreting plaintext
	if(1 != EVP_DecryptFinal_ex(ctx, plaintext + len, &len)) {
		secreteLibSSLError();
	}
	plaintext_len += len;

	// Cleanse
	EVP_CIPHER_CTX_free(ctx);

	return plaintext_len;
}

#pragma mark shit
/**
 * Initialize pls
 */
EXPORT void cryptoshit_init() {
	ERR_load_crypto_strings();
	OpenSSL_add_all_algorithms();
	OPENSSL_config(NULL);
}

/**
 * derive a key from the password
 */
EXPORT void cryptoshit_secrete_key(char *password, void *keyOut, size_t keyOutSz) {
	int status = -1;

	const char *salt = "fuck the patriarchy";

	// do the things
	status = PKCS5_PBKDF2_HMAC_SHA1(password, -1, (unsigned char *) salt, strlen(salt), 5000, keyOutSz, keyOut);

	// test???
	if(status != 1) {
		secreteLibSSLError();
	}
}

/**
 * does magical things to the shit in the input buffer of the given size and
 * secretes it into the output buffer of the same size. also if something bad
 * happens it crashes lol
 *
 * note: the output buffer needs to be 64 bytes bigger than the input buffer to
 * accomodate the generated IV
 */
EXPORT void cryptoshit_encrypt(void *key, void *in, size_t inSz, void *out, size_t outSz) {
	// check the output buffer size !!!
	size_t inSzUp = (inSz & 0xF) ? ((inSz & (~0xF)) + 0xF) : inSz;
	size_t minOutSz = inSzUp + IV_LENGTH;

	if(outSz < minOutSz) {
		printf("ur stupid the out buffer must be %lu, it's actually %lu (kill urself)\n", minOutSz, outSz);
		abort();
	}

	// genearte iv
	void *iv = out;
	uint64_t *plainSzPtr = (uint64_t *) (((uint8_t *) iv) + IV_LENGTH);
	uint64_t *cryptoSzPtr = (uint64_t *) (((uint8_t *) plainSzPtr) + 8);
	void *cryptoText = ((uint8_t *) cryptoSzPtr) + 8;

	*plainSzPtr = (uint64_t) inSz;

	generateIv(iv);

	// encrypt lol
	int bytesEncrypted = encrypt(in, inSz, key, iv, cryptoText);

	// get the crypto size
	*cryptoSzPtr = (uint64_t) bytesEncrypted;
}

/**
 * this does literally the exact same as the above one but in reverse lol. it
 * returns the amount of cubes
 */
EXPORT size_t cryptoshit_decrypt(void *key, void *in, size_t inSz, void *out, size_t outSz) {
	// check the shit
	if(outSz > inSz) {
		printf("no the output buffer is larger !!!\n");
		abort();
	}

	// get the shit
	void *iv = in;
	uint64_t *plainSzPtr = (uint64_t *) (((uint8_t *) iv) + IV_LENGTH);
	uint64_t *cryptoSzPtr = (uint64_t *) (((uint8_t *) plainSzPtr) + 8);
	void *cryptoText = ((uint8_t *) cryptoSzPtr) + 8;

	// get how many bytes we actually need to decrypt
	size_t bytesOfCryptoText = *cryptoSzPtr;

	// do a decryptification
	decrypt(cryptoText, bytesOfCryptoText, key, iv, out);

	return *plainSzPtr;
}