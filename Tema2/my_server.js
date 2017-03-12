const http = require("http");
const port = 3000;
const Responser = require("./server_responses")
const rs = new Responser();

class MyServer {
    constructor() {
        this.routes = {
            "GET": {},
            "POST": {},
            "PUT": {},
            "PATCH": {},
            "DELETE": {}
        };
    }
    /**
     * @param  {} root path of endpoint
     * @param  {} callback function to handle get request
     */
    get(root, callback) {
        console.log("regisetr " + root + " for GET request");
        this.routes["GET"][root] = callback;

    }
    /**
     * @param  {} root root of endpoint
     * @param  {} callback function to handle post request
     */
    post(root, callback) {
        this.routes["POST"][root] = callback;
    }
    /**
     * @param  {} root root of endpoint
     * @param  {} callback function to handle put request
     */
    put(root, callback) {
        this.routes["PUT"][root] = callback;
    }
    /**
     * @param  {} root root of endpoint
     * @param  {} callback function to handle patch request
     */
    patch(root, callback) {
        this.routes["PATCH"][root] = callback;
    }
    /**
     * @param  {} root root of endpoint
     * @param  {} callback function to handle  delete request
     */
    delete(root, callback) {
        this.routes["DELETE"][root] = callback;
    }
    mapRequest(req, res) {
        console.log("metoda:", req.method);
        var path = '/' + req.url.split('/')[1];

        // req['eventID'] = 10;
        res.send200 = rs.send200.bind(res);
        res.send400 = rs.send400.bind(res);
        res.send404 = rs.send404.bind(res);
        res.send500 = rs.send500.bind(res);

        var next = this.routes[req.method][path];
        if (!next) {
            res.send404();
            return;
        }
        this.mapVerb(req, res, req.method, path, next);

    }
    mapVerb(req, res, verb, route, next) {
        var url_split = req.url.split('/');
        console.log(url_split);
        if (req.method == "GET") {

            if (url_split.length > 3) {
                res.send404();
                return;
            }
            req.eventID = url_split[2];
            next(req, res);
        }
        if (req.method == "POST") {
            if (url_split.length > 2) {
                res.send400("");
                return;
            }
            var body = '';
            var postData;
            req.on('data', function (data) {
                body += data;

                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });

            req.on('end', function () {
                // console.log(body, body.length);
                try {
                    postData = JSON.parse(body);

                } catch (error) {
                    console.log(error)
                    // postData = null    
                }
                req.body = postData;
                // res .end(JSON.stringify(post));
                next(req, res);
            });
        }

        if(req.method == "PUT"){
            if (url_split.length > 3) {
                res.send404();
                return;
            }
            req.eventID = url_split[2];
            
            var body = '';
            var postData;
            req.on('data', function (data) {
                body += data;

                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });

            req.on('end', function () {
                try {
                    postData = JSON.parse(body);

                } catch (error) {
                    console.log(error)
                }
                req.body = postData;
                next(req, res);
            });
    }

    }
    serve() {
        const requestHendler = (request, response) => {
            console.log(request.url)
            this.mapRequest(request, response);

        }
        const server = http.createServer(requestHendler)
        server.listen(port, (err) => {
            if (err) {
                return console.log("something bad happened", err)
            }
            console.log("server is listening", port)
        })
    }

}

module.exports = MyServer;