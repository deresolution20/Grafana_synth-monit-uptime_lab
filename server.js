const http = require('http');


const server = http.createServer((req, res) => {
    // Generate a random delay between 1 and 6 seconds
    const delay = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World\n');
    }, delay * 1000);  // Convert to milliseconds
});


server.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://0.0.0.0:3000/');
});
