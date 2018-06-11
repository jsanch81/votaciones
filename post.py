import SimpleHTTPServer
import SocketServer
import logging
import cgi
import requests
import json

PORT = 8000

class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_GET(self):
        logging.error(self.headers)
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        content_len = int(self.headers.getheader('content-length', 0))
        post_body = self.rfile.read(content_len)
        print post_body
        salida = json.loads(post_body)
        url = 'http://localhost:3000/Votar'
        data1 ={'cc':salida['cedula'],'escrutinio':"0x8543e1125FFe3054F52F93A1F41c78501a7E87cb"}
        r = requests.post(url ,data=data1)
        respuetsa = json.loads(r.text);
        if (respuetsa['salida']!="USUARIO YA VOTO" and respuetsa['salida']!="USUARIO NO REGISTRADO"):
            print "hago el post"
        else:
            print "no hago el post"

        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

Handler = ServerHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
