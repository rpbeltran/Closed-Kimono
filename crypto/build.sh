#!/bin/sh
# who the fuck needs makefiles lmao

clang -dynamiclib -L/usr/local/opt/openssl/lib -I/usr/local/opt/openssl/include -lcrypto -std=c99 cryptoshit.c -fvisibility=hidden -o cryptoshit.A.dylib