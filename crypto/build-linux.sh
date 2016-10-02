#!/bin/sh
# who the fuck needs makefiles lmao

gcc -dynamiclib -lcrypto -std=c99 cryptoshit.c -fvisibility=hidden -o libcryptoshit.dylib

gcc -lcrypto -std=c99 cryptoshit-test.c -L. -lcryptoshit -o cryptoshit-test
./cryptoshit-test