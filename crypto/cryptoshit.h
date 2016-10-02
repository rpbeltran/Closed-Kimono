/**
 * This thing does some lit af shit yo
 */

#ifndef CRYPTOSHIT_H
#define CRYPTOSHIT_H

#include <stddef.h>
#include <stdint.h>

/**
 * Initialize pls
 */
void cryptoshit_init();

/**
 * derive a key from the password
 */
void cryptoshit_secrete_key(char *password, void *keyOut, size_t keyOutSz);

/**
 * does magical things to the shit in the input buffer of the given size and
 * secretes it into the output buffer of the same size. also if something bad
 * happens it crashes lol
 *
 * note: the output buffer needs to be 64 bytes bigger than the input buffer to
 * accomodate the generated IV
 */
void cryptoshit_encrypt(void *key, void *in, size_t inSz, void *out, size_t outSz);

/**
 * this does literally the exact same as the above one but in reverse lol. it
 * returns the amount of cubes
 */
size_t cryptoshit_decrypt(void *key, void *in, size_t inSz, void *out, size_t outSz);

#endif