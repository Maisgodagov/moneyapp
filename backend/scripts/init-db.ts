import { DatabaseService } from '../src/services/DatabaseService';

async function main() {
  const db = new DatabaseService();
  await db.createTables();
  await db.close();
  console.log('Таблицы успешно созданы!');
}

main().catch(console.error);
