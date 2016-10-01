from tornado import web, ioloop
from pymongo import MongoClient
import json
import hashlib
import requests



conf = json.loads(open("conf.json").read())

uri = "mongodb://"+conf['db_user']+":"+conf['db_pass']+"@"+conf['db_host']
client = MongoClient(uri)
db = client.get_default_database()[conf['db_name']]


class Security():
    def __init__(self, id):
        self.id = id


    def getSec(self):
        return db.sec.find_one({"searchid":self.id})


    def evalSec(self):

        pass


class IndexHandler(web.RequestHandler):
    def get(self, *args, **kwargs):
        self.write("welcome.")


class LoginHandler(web.RequestHandler):
    def post(self, *args, **kwargs):
        username = self.get_argument("username", None)
        security = self.get_argument("sec", None)

        sec = Security(username)




class APIHandler(web.RequestHandler):
    def post(self, *args, **kwargs):
        e = self.get_argument("endpoint")

        self.set_header("Content-Type", "application/json")

        if(e == "getsec"):
            sid = self.get_argument("sid")

            sec = Security(sid).getSec()

            del sec["_id"] #mongo object

            self.write(sec)



app = web.Application([
    (r"/", IndexHandler),
    (r"/auth", LoginHandler),
    (r"/api", APIHandler),
    (r'/static/(.*)', web.StaticFileHandler, {'path': "static"}),
], debug=True)


app.listen(1337)
ioloop.IOLoop.current().start()