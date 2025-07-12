const http = require('http');

function testServer() {
  console.log('Тестируем сервер...');
  
  // Тест health check
  const healthReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET'
  }, (res) => {
    console.log('Health check status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Health check response:', data);
      
      // После health check тестируем категории
      testCategories();
    });
  });
  
  healthReq.on('error', (err) => {
    console.error('Health check error:', err.message);
  });
  
  healthReq.end();
}

function testCategories() {
  const categoriesReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions/categories',
    method: 'GET'
  }, (res) => {
    console.log('Categories status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Categories response:', data);
    });
  });
  
  categoriesReq.on('error', (err) => {
    console.error('Categories error:', err.message);
  });
  
  categoriesReq.end();
}

testServer(); 