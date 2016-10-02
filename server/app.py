from tornado import web, ioloop
from pymongo import MongoClient
import json
import hashlib
import requests
from uuid import uuid1
from Crypto.Cipher import AES
import base64



conf = json.loads(open("conf.json").read())

uri = "mongodb://"+conf['db_user']+":"+conf['db_pass']+"@"+conf['db_host']
client = MongoClient(uri)
db = client.get_default_database()[conf['db_name']]

class LameCrypto(): #ToDo: this only works if the sting is
    def __init__(self, string, password):
        self.string = string
        self.password = hashPW(password)

    def encrypt(self):
        cipher = AES.new(self.password, AES.MODE_ECB) #Todo: ECB is apparently awful
        encoded = str(base64.b64encode(cipher.encrypt(self.string)))

        return encoded

    def decrypt(self):
        cipher = AES.new(self.password, AES.MODE_ECB)
        decoded = cipher.decrypt(base64.b64decode(self.string))

        return decoded.strip


class Security():
    def __init__(self, id):
        self.id = id


    def getSec(self):
        return db.sec.find_one({"sid":self.id})

    def getSecTypes(self):
        res=self.getSec()
        return {"passwords": len(res['passwords'])} #Update as more sec types are implemented

    def updateSec(self, secObj):
        db.sec.update({"sid":self.id}, {"$set": secObj}, upsert=False)

    def evalSec(self, secObj):
        res = self.getSec()

        for i in range(len(secObj['passwords'])):
            if secObj['passwords'][i] != hashPW(res['passwords'][i]):
                return False

        return True



def hashPW(pw): #Todo: @Tristan
    return hash(pw)

class IndexHandler(web.RequestHandler):
    def get(self, *args, **kwargs):
        self.write("welcome.")


class LoginHandler(web.RequestHandler):
    def post(self, *args, **kwargs):
        self.username = self.get_argument("username", None)
        security = self.get_argument("sec", None)

        sec = Security(self.username)
        if(sec.evalSec(security)):
            self.setLogin()



    def setLogin(self):
        sess=str(uuid1())
        user = db.users.find_one({"sid":self.username})
        user['sessions'].append(sess)

        db.users.update({"sid":self.username}, {"$set": user}, upsert=False)






class APIHandler(web.RequestHandler):
    def post(self, *args, **kwargs):
        e = self.get_argument("endpoint")

        self.set_header("Content-Type", "application/json")

        if(e == "getsec"):
            sid = self.get_argument("sid")

            sec = Security(sid).getSec()

            del sec["_id"] #mongo object
            self.write(json.dumps(sec))
            return


        elif(e == "createaccount"):
            username = self.get_argument("username", None)
            password = hashPW(self.get_argument("password", None))

            #ToDo: Check if username is already in db

            sess=str(uuid1())

            db.users.insert({"sid":username, "password":password, "notes":[], "sessions":[sess]})
            db.sec.insert({"sid":username, "passwords":[password]})

            print("Added")

            self.write(json.dumps({"status":200, "key":sess}))

            return

        elif(e == "createnote"):
            pass



if __name__ == "__main__":
    app = web.Application([
        (r"/", IndexHandler),
        (r"/auth", LoginHandler),
        (r"/api", APIHandler),
        (r'/static/(.*)', web.StaticFileHandler, {'path': "static"}),
    ], debug=True)

    print("restarting")
    app.listen(1337)
    ioloop.IOLoop.current().start()