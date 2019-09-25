// webby.js
const path = require('path');
const net = require('net');
const fs = require('fs');

const HTTP_STATUS_CODES = {
    200: 'OK',
    404: 'NOT FOUND',
    500: 'SERVER ERROR'
};

const MIME_TYPES = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    html: 'text/html',
    css: 'text/css',
    txt: 'text/plain'
}

const getExtension = (fileName) => {
    let str = path.extname(fileName);
    str = str.substring(1);
    return str;
}

const getMIMEType = (fileName) => {
    let ext = getExtension(fileName);
    if (MIME_TYPES.hasOwnProperty(ext)) {
        return MIME_TYPES[ext];
    } else {
        return '';
    }
}

class Request {
  constructor(s) {
    const [method, path] = s.split(' ');  
    this.method = method;
    this.path = path;
  }
}

class App {
    constructor() {
        this.server = net.createServer(sock => this.handleConnection(sock));
        this.routes = {};
        this.middleware = null;
    }
    normalizePath(p) {
         let path = p;
         path = p.toLowerCase();
         for (let i = 0; i < path.length; i++) {
             if (path[i] === "/" && i === path.length - 1) {
                 return path.slice(0, path.length - 1);
             } else if (path[i] === "?" || path[i] === "#") {
                 return path.slice(0, i);
             } else if (path[i] === "/" && (path[i+1] === "?" || path[i+1] === "#")) {
                 return path.slice(0, i);
             }
         }
         return path;
    }

    createRouteKey(method, path) {
        return method.toUpperCase() + " " + this.normalizePath(path);
    }

    get(path, cb) {
        this.routes[this.createRouteKey("GET", path)] = cb;
    }

    use(cb) {
        this.middleware = cb;
    }

    listen(port, host) {
        this.server.listen(port, host);
    }

    handleConnection(sock) {
        // why this syntax?
        sock.on('data', this.handleRequest.bind(this, sock));
    }

    handleRequest(sock, binaryData) {
        const req = new Request(binaryData + "");
        const res = new Response(sock);
        if (this.middleware != null) {
            this.middleware(req, res, () => {this.processRoutes(req, res)});
        } else { 
            this.processRoutes(req, res);
        }
    }

    processRoutes(req, res) {
        if (this.routes[req.method + " " + this.normalizePath(req.path)]) {
            this.routes[req.method + " " + this.normalizePath(req.path)](req, res);
        } else {
            res.statusCode = 404;
            res.send("Page not found.");
        }
    }
}

class Response {
    constructor(socket, statusCode = 200, version = "HTTP/1.1") {
        this.sock = socket;
        this.statusCode = statusCode;
        this.version = version;
        this.headers = {};
        this.body = undefined;
    }

    set(name, value) {
        this.headers[name] = value;
    }

    end() {
        this.sock.end();
    }

    statusLineToString() {
        if (this.statusCode === 200 && this.version === "HTTP/1.1") {
            return "HTTP/1.1 200 OK\r\n";
        } else if (this.statusCode === 404 && this.version === "HTTP/1.1") {
            return "HTTP/1.1 404 Not Found\r\n";
        } else if (this.statusCode === 500 && this.version === "HTTP/1.1") {
            return "HTTP/1.1 500 Internal Server Error\r\n";
        } else if (this.statusCode === 301 && this.version === "HTTP/1.1") {
            this.set("Location", "/gallery");
            return "HTTP/1.1 301 Redirect\r\n";
        }
    }

    headersToString() {
        let s = "";
        for(let i in this.headers) {
            s += i + ": " + this.headers[i] + "\r\n";
        }
        return s;
    }

    // makeResponse(status, contentType, body) {
    //     let response = `HTTP/1.1 ${status} ${HTTP_STATUS_CODES[status]}\r\n`;
    //     response += 'Server: my awesome server\r\n';
    //     response += `Content-Type: ${contentType}\r\n\r\n`;
    //     response += body;
    //     return response;
    // }

    send(body) {
        let s = "";
        s += this.statusLineToString();
        s += this.headersToString();
        // s += "Content-type: text/html\r\n" // <- do we have to hardcode the headers? How do we dynamically set them
        s += "\r\n";
        // why does console.log not print the headers?
        // you don't have to have headers to use send?
        this.sock.write(s);
        this.sock.write(body);
        //this.sock.write(this.makeResponse(this.statusCode, 'text/html', body));
        //why does this.sock.write(body) give no errors but this.sock.write('\r\n' + body) does?
        this.end();
    }

    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
}

const serveStatic = (basePath) => {
    return (req, res, next) => {
        let joinedPath = path.join(basePath, req.path);
        console.log(basePath);
        fs.readFile(joinedPath, (err, data) => {
            console.log('joinedPath', joinedPath);
            if (err) {
                console.log("ERROR", err);
                next();
            } else {
                console.log("FOUND IT");
                res.set('Content-Type', getMIMEType(joinedPath));
                res.status(200).send(data);
            }
        });
    }
}

module.exports = {
    HTTP_STATUS_CODES,
    MIME_TYPES,
    getExtension,
    getMIMEType,
    Request,
    App,
    Response,
    static: serveStatic
}