import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template
import tornado.httpserver

from twython import TwythonStreamer

connections = set()

class MainHandler(tornado.web.RequestHandler):
  def get(self):
    loader = tornado.template.Loader(".")
    self.write(loader.load("index.html").generate())
 
class TweetStepHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        connections.add(self)
        stream = MyStreamer('HEL8XE9rzMJOk5ZjZShSnFt3s', 'o16TD1T3QedgiKN3MrQaX3xMzRzFFqkorqicEBG4lmpw40qWw5',
                    '2347949490-DjgrORJsLhCMILo0Kv9CygVVyYFAzLjSZ6sVZ7d', '0uhXKJrlY8H12WtmMH1CnXPdqCjnmRETWYIg9cZV4fDCI')
        stream.statuses.filter(locations='-122.75,36.8,-121.75,37.8')

        return None

    def on_message(self, msg):
        print(msg)
        for c in connections:
            if c is self:
                continue
            c.write_message(msg)

    def on_close(self):
        connections.remove(self)

class MyStreamer(TwythonStreamer):
    def on_success(self, data):
        if 'text' in data:
            t = TweetStepHandler
            t.on_message(self, data)
            #print(data)

    def on_error(self, status_code, data):
        print(status_code)

        # Want to stop trying to get data because of the error?
        # Uncomment the next line!
        # self.disconnect()

def main():
    application = tornado.web.Application([
        (r"/tweetstep", TweetStepHandler),
        (r"/(.*)",tornado.web.StaticFileHandler, {"path": "./resources"}),
        (r'/', MainHandler),
        ])
    application.listen(9999)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
