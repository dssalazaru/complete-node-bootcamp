const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

// Custom module
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////
// Files
////////////////////////////////////////

// Synchronous
// const data = fs.readFileSync('txt/input.txt', 'utf-8');
// const message = `The first file content is: ${data} \n Declarate on ${Date.now().toString()}`;
// fs.writeFileSync('txt/output.txt', message);
// console.log('Done');

// Async Non-Block
// fs.readFile('txt/start.txt', 'utf-8', (error, data) => {
//     console.log(data)
// })
// console.log('Finish')

////////////////////////////////////////
// SERVER
////////////////////////////////////////
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')



const db = fs.readFileSync('dev-data/data.json', 'utf-8');
const dbObj = JSON.parse(db)

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardHtml = dbObj.map(item => replaceTemplate(tempCard, item)).join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml)

    res.end(output);
  }
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dbObj.filter(item => query.id == item.id)[0]
    if (!product) return res.end('not fount');
    const productHtml = replaceTemplate(tempProduct, product);

    res.end(productHtml);
  }
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(db);
  }

  else {
    res.writeHead(404, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ "code": 404 }));
  }
})

server.listen(8000, '0.0.0.0', () => {
  console
    .log('Running server');
})