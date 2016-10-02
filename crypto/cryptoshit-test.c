#include "cryptoshit.h"

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#include <openssl/conf.h>

int main(int argc, char *argv[]) {
	// START THE MACHINEMAJIOG
	cryptoshit_init();

	// generate a key
	char *password = "this is where the password goes";
	unsigned char *key[32];

	cryptoshit_secrete_key(password, key, 32);

	printf("derived key from password '%s':\n", password);
	BIO_dump_fp(stdout, (const char *) key, 32);	

	// ok u hoe allocate an buffers
	char *inTxt = "A spectre is haunting Europe — the spectre of communism. All the powers of old Europe have entered into a holy alliance to exorcise this spectre: Pope and Tsar, Metternich and Guizot, French Radicals and German police-spies.\nWhere is the party in opposition that has not been decried as communistic by its opponents in power? Where is the opposition that has not hurled back the branding reproach of communism, against the more advanced opposition parties, as well as against its reactionary adversaries?\nTwo things result from this fact:\n\tI. Communism is already acknowledged by all European powers to be itself a power.\n\tII. It is high time that Communists should openly, in the face of the whole world, publish their views, their aims, their tendencies, and meet this nursery tale of the Spectre of Communism with a manifesto of the party itself.\nTo this end, Communists of various nationalities have assembled in London and sketched the following manifesto, to be published in the English, French, German, Italian, Flemish and Danish languages.";
	size_t inSz = strlen(inTxt) + 1; // add 1 for \0

	size_t outTxtSz = 2048;
	char *outTxt = (char *) malloc(outTxtSz);
	memset(outTxt, 0x00, outTxtSz);

	size_t cryptoBufSz = 2048;
	void *cryptoBuf = malloc(cryptoBufSz);
	memset(cryptoBuf, 0x00, cryptoBufSz);

	// attempt an encryptification and secrete
	cryptoshit_encrypt(key, inTxt, inSz, cryptoBuf, cryptoBufSz);

	printf("%p bytes of plaintext\n", (void *) inSz);
	BIO_dump_fp(stdout, (const char *) cryptoBuf, cryptoBufSz);


	// do a decrypt
	size_t actuallyDecrypted = 0;
	actuallyDecrypted = cryptoshit_decrypt(key, cryptoBuf, cryptoBufSz, outTxt, outTxtSz);

	outTxt[actuallyDecrypted] = 0x00;
	printf("%s", outTxt);
}