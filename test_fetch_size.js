const http = require('http');

const data = JSON.stringify({
  taikhoan: 'KH-987E7770',
  matkhau: '123'
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 8001,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const token = JSON.parse(body).accessToken;
    
    // Fetch menus
    http.get({
      hostname: '127.0.0.1',
      port: 8001,
      path: '/api/v1/menus/items',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      let b = 0;
      res.on('data', d => b += d.length);
      res.on('end', () => console.log('Menus API size:', b));
    });
    
    // Fetch orders
    http.get({
      hostname: '127.0.0.1',
      port: 8001,
      path: '/api/v1/orders/history',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      let b = 0;
      res.on('data', d => b += d.length);
      res.on('end', () => console.log('Orders API size:', b));
    });
  });
});
req.write(data);
req.end();
