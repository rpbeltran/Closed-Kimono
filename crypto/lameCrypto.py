from ctypes import *
from Crypto import Random
from Crypto.Cipher import AES
import base64

class LameCrypto():
	def __init__(self, string, password):
		self.string = string
		self.password = self.hashPW(password)

	def encrypt(self):
		cipher = AES.new(self.password, AES.MODE_CBC, 'This is an IV456')
		encoded = str(base64.b64encode(cipher.encrypt(self.string)))

		return encoded

	def decrypt(self):
		cipher = AES.new(self.password, AES.MODE_CBC, 'This is an IV456')
		decoded = cipher.decrypt(base64.b64decode(self.string))

		return decoded.strip

	def hashPW(pw):
		return hash(pw)