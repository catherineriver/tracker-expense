# Real-Time Data Setup Guide

## Step 1: Install Supabase

```bash
# In the root directory
pnpm add @supabase/supabase-js

# For the mobile app (for real-time features)
cd apps/mobile
pnpm add @supabase/supabase-js
```

## Step 2: Create Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Get your project URL and anon key
4. Set up database tables

### Database Schema

```sql
-- Users table (auto-created with Supabase auth)
-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their expenses
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
```

## Step 3: Create Supabase Client

Create `packages/api/src/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description?: string | null
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
```

## Step 4: Update Auth API

Update `packages/api/src/auth.ts`:

```typescript
import { supabase } from './supabase'

export class AuthAPI {
  async login(request: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: request.email,
      password: request.password,
    })
    
    if (error) throw error
    return { user: data.user, token: data.session?.access_token }
  }

  async register(request: { email: string; password: string; name: string }) {
    const { data, error } = await supabase.auth.signUp({
      email: request.email,
      password: request.password,
      options: {
        data: {
          name: request.name
        }
      }
    })
    
    if (error) throw error
    return { user: data.user, token: data.session?.access_token }
  }

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
  }

  async logout() {
    await supabase.auth.signOut()
  }

  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession()
    return !!data.session
  }
}
```

## Step 5: Update Expenses API with Real-time

Update `packages/api/src/expenses.ts`:

```typescript
import { supabase } from './supabase'
import { ExpenseItem, CreateExpenseRequest, UpdateExpenseRequest } from '../../utils/src'

export class ExpensesAPI {
  private async requireAuth(): Promise<string> {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      throw new Error('Authentication required')
    }
    return data.user.id
  }

  async createExpense(request: CreateExpenseRequest): Promise<ExpenseItem> {
    const userId = await this.requireAuth()
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: userId,
          amount: request.amount,
          category: request.category,
          description: request.description,
          date: request.date,
        }
      ])
      .select()
      .single()

    if (error) throw error
    return this.mapSupabaseExpense(data)
  }

  async getExpenses(filter?: any): Promise<ExpenseItem[]> {
    const userId = await this.requireAuth()
    
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    
    return data.map(this.mapSupabaseExpense)
  }

  async updateExpense(request: UpdateExpenseRequest): Promise<ExpenseItem> {
    const userId = await this.requireAuth()
    
    const { data, error } = await supabase
      .from('expenses')
      .update({
        amount: request.amount,
        category: request.category,
        description: request.description,
        date: request.date,
        updated_at: new Date().toISOString()
      })
      .eq('id', request.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return this.mapSupabaseExpense(data)
  }

  async deleteExpense(id: string): Promise<void> {
    const userId = await this.requireAuth()
    
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Real-time subscription
  subscribeToExpenses(userId: string, callback: (expenses: ExpenseItem[]) => void) {
    return supabase
      .channel('expenses')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${userId}` },
        () => {
          // Refetch expenses when changes occur
          this.getExpenses().then(callback)
        }
      )
      .subscribe()
  }

  private mapSupabaseExpense(data: any): ExpenseItem {
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      category: data.category,
      description: data.description || '',
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }
}
```

## Step 6: Add Real-time to React Components

Update `apps/mobile/src/components/ExpenseList.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { ExpensesAPI } from '../../../../packages/api'
import { supabase } from '../../../../packages/api/src/supabase'

export const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const expensesAPI = new ExpensesAPI()

  useEffect(() => {
    loadExpenses()
    
    // Set up real-time subscription
    const channel = expensesAPI.subscribeToExpenses(
      'current-user-id', // You'll need to get this from auth
      (updatedExpenses) => {
        setExpenses(updatedExpenses)
      }
    )

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // ... rest of component
}
```

## Step 7: Environment Configuration

Create `.env` files:

```env
# .env.local (for development)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 8: Offline Support (Optional)

For offline-first approach, you can:
1. Keep local storage as cache
2. Sync with Supabase when online
3. Queue operations when offline

## Benefits of This Approach

✅ **Real-time Updates**: Changes sync instantly across devices
✅ **Authentication**: Built-in user management
✅ **Security**: Row-level security policies
✅ **Scalability**: Handles multiple users automatically
✅ **Offline Support**: Can be added incrementally
✅ **Cross-platform**: Works on both web and mobile

## Migration Strategy

1. **Phase 1**: Set up Supabase and test with new users
2. **Phase 2**: Add migration script to move local data to Supabase
3. **Phase 3**: Switch API to use Supabase by default
4. **Phase 4**: Remove local storage fallback

This gives you a production-ready real-time expense tracker that syncs across all devices!
