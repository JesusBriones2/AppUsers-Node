const fs = require('fs');
const http = require('http');


const PORT = process.env.PORT || 3000;


const server = http.createServer((req, res) => {

    switch (req.method) {
        case "GET":
            return requestGET(req, res);
        
        case "POST":
            return requestPOST(req, res);

        case "DELETE":
            return requestDELETE(req, res);
        
        default:
            res.end('No se encontró respuesta para ese método.')
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
})







function requestGET(req, res){

    if (req.url === '/') {
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./src/static/index.html').pipe(res);
    }

    else if (req.url === '/main.css') {
        res.setHeader('Content-type', 'text/css');
        fs.createReadStream('./src/static/main.css').pipe(res);
    }

    else if (req.url === '/script.js') {
        res.setHeader('Content-type', 'application/javascript');
        fs.createReadStream('./src/static/script.js').pipe(res)
    }

    else if (req.url == '/listUsers') {
        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./src/static/listUsers.html').pipe(res);
    }

    else if (req.url == '/getdatausers') {
        fs.readFile('./src/db.json', 'utf-8', (err, data) => {
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify(JSON.parse(data).users))
        })
    }

    else res.end('No se ha encontrado la ruta especificada.')
}



function requestPOST(req, res){

    if (req.url === '/') {

        let content = '';

        req.on('data', c => {
            content += c.toString();
        })

        req.on('end', () => {
            const form = new URLSearchParams(content)
            fs.readFile('./src/db.json', 'utf-8', (err, data) => {
                if (data) {
                    const db = JSON.parse(data);

                    if (!Object.keys(db.users).includes(form.get('username'))) {
                        db.users[form.get('username')] = {
                            id: db.length,
                            username: form.get('username'),
                            password: form.get('password')
                        }

                        db.length++;

                        fs.writeFile('./src/db.json', JSON.stringify(db), () => {});
                    }
                    else {
                        console.log("Ya existe el usuario.");
                    }

                }
            })
        })

        res.setHeader('Content-type', 'text/html');
        fs.createReadStream('./src/static/index.html').pipe(res);
    }
}



function requestDELETE(req, res) {
    if (req.url == '/delete') {

        let data = ''

        req.on('data', content => {
            data += content;
        })

        req.on('end', () => {

            fs.readFile('./src/db.json', 'utf-8', (err, content) => {

                let db = JSON.parse(content);
                let user = '';

                Object.keys(db.users).forEach((elem) => {


                    if (db.users[elem].id == JSON.parse(data).id) {
                        user = db.users[elem].username;
                    }
                })

                if (user != '') {
                    delete db.users[user];
                    fs.writeFile('./src/db.json', JSON.stringify(db), () => {})
                    res.end(`{"delete": true}`);
                }
                else {
                    res.end(`{"delete": false}`);
                }
            })
        })

    }
}