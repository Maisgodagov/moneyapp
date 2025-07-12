const fetch = require('node-fetch');

async function testServer() {
  try {
    console.log('Тестируем сервер...');
    
    // Тест health check
    const healthResponse = await fetch('http://localhost:3000/api/health');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health check response:', healthData);
    }
    
    // Тест получения категорий
    const categoriesResponse = await fetch('http://localhost:3000/api/transactions/categories');
    console.log('Categories status:', categoriesResponse.status);
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log('Categories response:', categoriesData);
    } else {
      const errorText = await categoriesResponse.text();
      console.log('Categories error:', errorText);
    }
    
  } catch (error) {
    console.error('Ошибка при тестировании сервера:', error.message);
  }
}

testServer(); 