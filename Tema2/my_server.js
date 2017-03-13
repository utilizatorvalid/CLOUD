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
            return res.send404();

        }
        this.mapVerb(req, res, req.method, path, next);

    }
    mapVerb(req, res, verb, route, next) {
        var url_split = req.url.split('/');
        console.log(url_split);
        if (req.method == "GET" || req.method == "DELETE") {

            if (url_split.length > 3)
                return res.send404();

            req.eventID = url_split[2];
            return next(req, res);
        }
        if (req.method == "POST") {
            if (url_split.length > 2)
                return res.send400("Please post on /events");

            var body = '';
            var postData;
            req.on('data', function (data) {
                body += data;
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
                return next(req, res);
            });
        }

        if (req.method == "PUT" || req.method == "PATCH") {
            if (url_split.length > 3)
                return res.send404();

            req.eventID = url_split[2];

            var body = '';
            var postData;
            req.on('data', function (data) {
                body += data;
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
                return next(req, res);
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