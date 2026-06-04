const http = require('http');

http.get({
    hostname: '127.0.0.1',
    port: 8001,
    path: '/api/v1/promotions/active',
}, (res2) => {
    let b = '';
    res2.on('data', d => b += d);
    res2.on('end', () => console.log('Active promotions API res:', b.substring(0, 100) + '...'));
});
