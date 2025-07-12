const { CategoryService } = require('./src/services/CategoryService');

// Тестовые данные из вашего примера
const testTransactions = [
  {
    description: "Кэшбэк за обычные покупки Дата и время операции Дата обработки Сумма в валюте счётаОписание Сумма операции Операции по карте No 220070******4592 МЕРКУЛОВА ЕВГЕНИЯ Расходы: 63 940.00 i",
    expectedCategory: "Кэшбэк"
  },
  {
    description: "Оплата в Додо Пицца, К7",
    expectedCategory: "Питание"
  },
  {
    description: "Плата за оповещения об операциях",
    expectedCategory: "Связь и интернет"
  },
  {
    description: "Оплата в Russian Railways Moscow RUS",
    expectedCategory: "Транспорт"
  },
  {
    description: "Оплата в chibbis G ARKHANGELSK RU",
    expectedCategory: "Питание"
  },
  {
    description: "Внутрибанковский перевод с договора 5447575415",
    expectedCategory: "Перевод"
  },
  {
    description: "Отмена операции оплаты YANDEX*7999*SCOOTERS Moscow RUS",
    expectedCategory: "Возврат"
  },
  {
    description: "Оплата в YANDEX*4121*TAXI Moscow RUS",
    expectedCategory: "Такси"
  },
  {
    description: "Оплата в YANDEX*7999*SCOOTERS Moscow RUS",
    expectedCategory: "Доставка"
  },
  {
    description: "Оплата в SBER*5411*SAMOKAT SANKT- PETERBU RUS",
    expectedCategory: "Доставка"
  },
  {
    description: "Внешний банковский перевод счёт 03100643000000018500, ОТДЕЛЕНИЕ ТУЛА БАНКА РОССИИ //УФК по Тульской области",
    expectedCategory: "Перевод"
  },
  {
    description: "Внешний перевод по номеру телефона +79618595137",
    expectedCategory: "Перевод"
  },
  {
    description: "Пополнение. Система быстрых платежей",
    expectedCategory: "Пополнение"
  },
  {
    description: "Внешний перевод по номеру телефона +79035934747",
    expectedCategory: "Перевод"
  },
  {
    description: "Внутренний перевод на договор 5471323005",
    expectedCategory: "Перевод"
  },
  {
    description: "Оплата в TK LENTA-39 Krasnodar RUS",
    expectedCategory: "Продукты"
  },
  {
    description: "Оплата в APTEKA 58 - KASSA 2 Krasnodar RUS",
    expectedCategory: "Аптеки"
  },
  {
    description: "Оплата в Мужская территория",
    expectedCategory: "Селф-кейр"
  },
  {
    description: "Оплата в YANDEX*4215*DOSTAVKA Moscow RUS",
    expectedCategory: "Доставка"
  },
  {
    description: "Внесение наличных через банкомат Т- Банк",
    expectedCategory: "Пополнение"
  },
  {
    description: "Внешний перевод по номеру телефона +79035934747",
    expectedCategory: "Перевод"
  },
  {
    description: "Оплата услуг mBank.beeline",
    expectedCategory: "Связь и интернет"
  },
  {
    description: "Снятие наличных ATM.T-BANK KRASNODAR RUS",
    expectedCategory: "Снятие"
  },
  {
    description: "Внутрибанковский перевод с договора 5489281660",
    expectedCategory: "Перевод"
  },
  {
    description: "Внутренний перевод на договор 5471323005",
    expectedCategory: "Перевод"
  },
  {
    description: "Оплата в EBK_PROEZD TKPAY_TPP Krasnodar RUS",
    expectedCategory: "Транспорт"
  },
  {
    description: "Оплата в БЕГЕТ",
    expectedCategory: "Хостинг"
  },
  {
    description: "Оплата в YM*secstant AFIPSKIY RU",
    expectedCategory: "Услуги"
  },
  {
    description: "Оплата в NETMONET",
    expectedCategory: "Хостинг"
  },
  {
    description: "Оплата в SBER*5411*KUPER2_ MOSCOW RUS",
    expectedCategory: "Чаевые"
  },
  {
    description: "Оплата в Any2text",
    expectedCategory: "Услуги"
  },
  {
    description: "Выплата по вашему обращению",
    expectedCategory: "Возврат"
  },
  {
    description: "Оплата в SBERЧАЕВЫЕ__SBP",
    expectedCategory: "Чаевые"
  },
  {
    description: "Оплата в PRIZOVOJ MAGAZIN Krasnodar RUS",
    expectedCategory: "Развлечения"
  }
];

console.log('Тестирование системы категоризации...\n');

let correct = 0;
let total = testTransactions.length;

testTransactions.forEach((test, index) => {
  const actualCategory = CategoryService.categorizeTransaction(test.description);
  const isCorrect = actualCategory === test.expectedCategory;
  
  if (isCorrect) {
    correct++;
  }
  
  console.log(`${index + 1}. ${test.description.substring(0, 50)}...`);
  console.log(`   Ожидалось: ${test.expectedCategory}`);
  console.log(`   Получено:  ${actualCategory}`);
  console.log(`   Результат: ${isCorrect ? '✅' : '❌'}\n`);
});

console.log(`\nИтоговый результат: ${correct}/${total} (${Math.round(correct/total*100)}%)`);

console.log('\nВсе доступные категории:');
console.log(CategoryService.getAllCategories()); 