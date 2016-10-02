from ctypes import *

class LameCrypto():
	def __init__(self, string, password):
		self.string = string
		self.password = hashPW(password)

		# load the el cryptomajoig (replace with the name of the library on your system)
		self.cryptoshit = CDLL("libcryptoshit.dylib")

	def encrypt(self):
		pass

	def decrypt(self):
		pass