const { CategoryService } = require('./src/services/CategoryService');

// Тестируем обновление категории
console.log('Тестирование обновления категории...\n');

const testDescription = "Оплата в Додо Пицца, К7";
const newCategory = "Рестораны";

console.log(`Исходная категория для "${testDescription}":`);
console.log(CategoryService.categorizeTransaction(testDescription));

console.log('\nОбновляем категорию...');
CategoryService.updateCategoryForDescription(testDescription, newCategory);

console.log(`Новая категория для "${testDescription}":`);
console.log(CategoryService.categorizeTransaction(testDescription));

console.log('\nДобавляем новое правило категоризации...');
CategoryService.addCategoryRule(['оплата в тест'], 'Тестовая категория', 150);

console.log('\nВсе доступные категории:');
console.log(CategoryService.getAllCategories());

console.log('\nВсе правила категоризации:');
console.log(CategoryService.getCategoryRules()); 