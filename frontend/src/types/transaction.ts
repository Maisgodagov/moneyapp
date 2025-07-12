import type { Transaction } from "../features/transactions/transactionsSlice";

export type ParsedTransaction = Omit<Transaction, 'id' | 'userId'>; 