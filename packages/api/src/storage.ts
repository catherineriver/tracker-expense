import { User, Expense, AuthRequest, CreateExpenseRequest, UpdateExpenseRequest } from '../../utils/src';

const STORAGE_KEYS = {
  USER: 'expense_tracker_user',
  TOKEN: 'expense_tracker_token',
  EXPENSES: 'expense_tracker_expenses',
  USERS: 'expense_tracker_users'
};

// Cross-platform storage that works on both web and React Native
class UniversalStorage {
  private memoryStorage = new Map<string, string>();
  private isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  private asyncStorage: any = null;

  constructor() {
    // Try to import AsyncStorage for React Native
    if (!this.isWeb) {
      try {
        // Dynamic import for React Native AsyncStorage
        this.asyncStorage = require('@react-native-async-storage/async-storage').default;
      } catch (e) {
        // AsyncStorage not available, fall back to memory
        console.warn('AsyncStorage not available, using memory storage');
      }
    }
  }
  
  async setItem(key: string, value: string): Promise<void> {
    this.memoryStorage.set(key, value);
    
    // Save to appropriate persistent storage
    if (this.isWeb) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // Ignore localStorage errors
      }
    } else if (this.asyncStorage) {
      try {
        await this.asyncStorage.setItem(key, value);
      } catch (e) {
        console.warn('AsyncStorage setItem failed:', e);
      }
    }
  }
  
  async getItem(key: string): Promise<string | null> {
    // Try persistent storage first
    if (this.isWeb) {
      try {
        const localValue = localStorage.getItem(key);
        if (localValue) {
          this.memoryStorage.set(key, localValue); // Cache it in memory
          return localValue;
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    } else if (this.asyncStorage) {
      try {
        const asyncValue = await this.asyncStorage.getItem(key);
        if (asyncValue) {
          this.memoryStorage.set(key, asyncValue); // Cache it in memory
          return asyncValue;
        }
      } catch (e) {
        console.warn('AsyncStorage getItem failed:', e);
      }
    }
    
    // Fall back to memory
    return this.memoryStorage.get(key) || null;
  }
  
  async removeItem(key: string): Promise<void> {
    this.memoryStorage.delete(key);
    
    if (this.isWeb) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignore localStorage errors
      }
    } else if (this.asyncStorage) {
      try {
        await this.asyncStorage.removeItem(key);
      } catch (e) {
        console.warn('AsyncStorage removeItem failed:', e);
      }
    }
  }
}

export class LocalStorage {
  private storage = new UniversalStorage();
  
  async setItem(key: string, value: any): Promise<void> {
    await this.storage.setItem(key, JSON.stringify(value));
  }
  
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }
  
  async removeItem(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }
}

export class ExpenseStorage {
  private storage = new LocalStorage();
  
  async saveUser(user: User, token: string): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.USER, user);
    await this.storage.setItem(STORAGE_KEYS.TOKEN, token);
  }
  
  async getUser(): Promise<User | null> {
    return await this.storage.getItem<User>(STORAGE_KEYS.USER);
  }
  
  async getToken(): Promise<string | null> {
    return await this.storage.getItem<string>(STORAGE_KEYS.TOKEN);
  }
  
  async logout(): Promise<void> {
    await this.storage.removeItem(STORAGE_KEYS.USER);
    await this.storage.removeItem(STORAGE_KEYS.TOKEN);
  }
  
  async saveExpenses(userId: string, expenses: Expense[]): Promise<void> {
    const allExpenses = (await this.storage.getItem<Record<string, Expense[]>>(STORAGE_KEYS.EXPENSES)) || {};
    allExpenses[userId] = expenses;
    await this.storage.setItem(STORAGE_KEYS.EXPENSES, allExpenses);
  }
  
  async getExpenses(userId: string): Promise<Expense[]> {
    const allExpenses = (await this.storage.getItem<Record<string, Expense[]>>(STORAGE_KEYS.EXPENSES)) || {};
    return allExpenses[userId] || [];
  }
  
  async saveRegisteredUser(user: User): Promise<void> {
    const users = (await this.storage.getItem<User[]>(STORAGE_KEYS.USERS)) || [];
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    await this.storage.setItem(STORAGE_KEYS.USERS, users);
  }
  
  async findUserByEmail(email: string): Promise<User | null> {
    const users = (await this.storage.getItem<User[]>(STORAGE_KEYS.USERS)) || [];
    return users.find(user => user.email === email) || null;
  }
}