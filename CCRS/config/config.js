const http = require('http');
const url = require('url');
const fs = require('fs');

const host = 'localhost';
const port = 8080;

http.createServer((req, res) => {
    const jsonURL = url.parse(req.url, true);
    const path = "." + jsonURL.pathname;
    fs.readFile(path, 'utf8', (e, data) => {
        if (e) throw e
        console.log(data);

        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Access-Control-Allow-Origin',  '*');
        res.writeHead(200);
        res.end(data);
    });
}).listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});