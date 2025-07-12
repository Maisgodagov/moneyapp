export interface CategoryRule {
  keywords: string[];
  category: string;
  priority: number; // Чем выше приоритет, тем раньше проверяется правило
}

export class CategoryService {
  private static categoryRules: CategoryRule[] = [
    // Доходы - высокий приоритет
    {
      keywords: ['кэшбэк за обычные покупки', 'cashback'],
      category: 'Кэшбэк',
      priority: 100
    },
    {
      keywords: ['пополнение. система быстрых платежей', 'пополнение. мтс-банк'],
      category: 'Пополнение',
      priority: 95
    },
    {
      keywords: ['внутрибанковский перевод с договора'],
      category: 'Перевод',
      priority: 90
    },
    {
      keywords: ['отмена операции', 'выплата по вашему обращению'],
      category: 'Возврат',
      priority: 85
    },
    {
      keywords: ['внесение наличных через банкомат'],
      category: 'Пополнение наличными',
      priority: 80
    },

    // Такси - отдельная категория
    {
      keywords: ['оплата в yandex*4121*taxi', 'оплата в yandex*4121*yandex go'],
      category: 'Такси',
      priority: 75
    },

    // Самокаты и доставка
    {
      keywords: ['оплата в sber*5411*samokat'],
      category: 'Доставка',
      priority: 75
    },
    {
      keywords: ['оплата в yandex*4215*dostavka', 'оплата в sber*5411*kuper2_'],
      category: 'Доставка',
      priority: 75
    },

    // Общественный транспорт
    {
      keywords: ['оплата в sbp_avtovokzaly.ru', 'оплата в yandex*7999*scooters', 'оплата в krasnodarskij_av', 'оплата в plata za proezd', 'оплата в ebk_proezd'],
      category: 'Транспорт',
      priority: 75
    },
    {
      keywords: ['оплата в russian railways'],
      category: 'Транспорт',
      priority: 75
    },

    // Связь и интернет
    {
      keywords: ['оплата услуг mbank.beeline', 'плата за оповещения об операциях'],
      category: 'Связь и интернет',
      priority: 70
    },

    // Продукты
    {
      keywords: ['оплата в tk lenta-39'],
      category: 'Продукты',
      priority: 65
    },

    // Аптеки
    {
      keywords: ['оплата в apteka'],
      category: 'Аптеки',
      priority: 65
    },

    // Питание
    {
      keywords: ['оплата в додо пицца', 'оплата в chibbis', 'оплата в kubana toskana'],
      category: 'Питание',
      priority: 65
    },

    // Хостинг
    {
      keywords: ['оплата в БЕГЕТ'],
      category: 'Хостинг',
      priority: 60
    },

    // Селф-кейр (барбершоп, салоны красоты)
    {
      keywords: ['оплата в мужская территория'],
      category: 'Селф-кейр',
      priority: 60
    },

    // Чаевые
    {
      keywords: ['оплата в sberчаевые__sbp', 'оплата в netmonet'],
      category: 'Чаевые',
      priority: 60
    },

    // Услуги
    {
      keywords: ['оплата в any2text', 'оплата в ym*secstant'],
      category: 'Услуги',
      priority: 60
    },

    // Развлечения
    {
      keywords: ['оплата в prizovoj magazin'],
      category: 'Развлечения',
      priority: 60
    },

    // Переводы
    {
      keywords: ['внешний перевод по номеру телефона', 'внешний банковский перевод'],
      category: 'Перевод',
      priority: 55
    },
    {
      keywords: ['внутренний перевод на договор', 'внутренний перевод на карту'],
      category: 'Перевод',
      priority: 55
    },

    // Снятие наличных
    {
      keywords: ['снятие наличных'],
      category: 'Снятие',
      priority: 50
    },

    // Общие покупки (низкий приоритет)
    {
      keywords: ['оплата в'],
      category: 'Покупка',
      priority: 10
    }
  ];

  static categorizeTransaction(description: string): string {
    const desc = description.toLowerCase();
    
    // Сортируем правила по приоритету (от высокого к низкому)
    const sortedRules = [...this.categoryRules].sort((a, b) => b.priority - a.priority);
    
    for (const rule of sortedRules) {
      for (const keyword of rule.keywords) {
        if (desc.includes(keyword.toLowerCase())) {
          return rule.category;
        }
      }
    }
    
    return 'Прочее';
  }

  static getAllCategories(): string[] {
    const categories = new Set<string>();
    this.categoryRules.forEach(rule => {
      categories.add(rule.category);
    });
    categories.add('Прочее');
    return Array.from(categories).sort();
  }

  static getCategoryRules(): CategoryRule[] {
    return [...this.categoryRules].sort((a, b) => b.priority - a.priority);
  }

  // Добавить новое правило категоризации
  static addCategoryRule(keywords: string[], category: string, priority: number = 50): void {
    // Удаляем существующие правила с такими же ключевыми словами
    this.categoryRules = this.categoryRules.filter(rule => 
      !rule.keywords.some(keyword => keywords.includes(keyword))
    );
    
    // Добавляем новое правило
    this.categoryRules.push({
      keywords,
      category,
      priority
    });
  }

  // TODO: Refactor to support user-specific category rules. The rules are currently global.
  // Обновить категорию для определенного описания
  static updateCategoryForDescription(description: string, newCategory: string): void {
    const desc = description.toLowerCase();
    
    // Удаляем существующие правила, которые содержат это описание
    this.categoryRules = this.categoryRules.filter(rule => 
      !rule.keywords.some(keyword => desc.includes(keyword.toLowerCase()))
    );
    
    // Добавляем новое правило с высоким приоритетом
    this.categoryRules.push({
      keywords: [description],
      category: newCategory,
      priority: 200 // Высокий приоритет для пользовательских правил
    });
  }

  // Получить все уникальные описания из базы данных для конкретного пользователя
  static async getUniqueDescriptions(db: any, userId: number): Promise<string[]> {
    const query = 'SELECT DISTINCT description FROM transactions WHERE user_id = ? ORDER BY description';
    const result = await db.query(query, [userId]);
    return result.map((row: any) => row.description);
  }

  // Обновить категории для всех транзакций с определенным описанием для конкретного пользователя
  static async updateCategoriesForDescription(db: any, description: string, newCategory: string, userId: number): Promise<number> {
    const query = 'UPDATE transactions SET category = ?, updated_at = NOW() WHERE description = ? AND user_id = ?';
    const result = await db.query(query, [newCategory, description, userId]);
    return result.affectedRows || 0;
  }
} 