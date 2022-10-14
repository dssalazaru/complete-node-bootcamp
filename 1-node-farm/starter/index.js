const fs = require('fs');

const data = fs.readFileSync('txt/input.txt', 'utf-8');

// console.log(data);

const message = `The first file content is: ${data} \n Declarate on ${Date.now().toString()}`;
const dataWrite = fs.writeFileSync('txt/output.txt', message);

console.log('Done');