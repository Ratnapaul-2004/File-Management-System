const fs = require('fs');
const path = require('path');
const http = require('http');

const { parse } = require('url');

const port = 8080;

const server = http.createServer((req,res) => {
  const { pathname, query } = parse(req.url,true);

  const folder = path.join(__dirname, 'textFiles');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  const file = path.join(folder, query.filename || 'file.txt');

  if(pathname == '/create'){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    fs.writeFile(file, query.content || 'Hello user!', 'utf8', (err) => {
      if(err){
        res.end('Error creating file');
      } else {
        res.end('File created');
        console.log('File written successfully');
      }
    });
  } 
  else if(pathname == '/read'){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    fs.readFile(file, 'utf8', (err, data) => {
      if(err){
        res.end('File not found');
      } else {
        res.end(data);
        console.log(data);
      }
    });
  }
  else if(pathname == '/delete'){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    fs.unlink(file, err => {
      if(err){
        res.end('Error deleting file');
      } else {
        res.end('File deleted');
        console.log('File deleted successfully');
      }
    });
  }
  else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Use /create, /read or /delete with ?filename=');
  }
});

server.listen(port, (err) => {
  if(!err){
    console.log(`Server running at port ${port}`);
  } else {
    console.log(`Something went wrong`,err);
  }
});