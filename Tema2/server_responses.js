class Responer {
    constructor() {

    }
    send200(data) {
        this.writeHead(200, {
            'Content-Type': 'json'
        });
        this.write(JSON.stringify({
            statusCode: 200,
            data: data
        }, null, 4))
        this.end();
    }
    send400(data) {
        this.writeHead(400, {
            'Content-Type': 'json'
        });
        this.write("bad request");
        this.end();
    }
    send404() {
        this.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        this.write("There is no souch a route registred :( bad request ");
        this.end();
    }    
    send500() {
        this.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        this.write("Highly trained monkey will fix this soon :D");
        this.end();
    }
}

module.exports = Responer;