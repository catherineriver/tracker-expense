// Test script to verify Supabase setup
// Run this with: node -r ts-node/register packages/api/src/test-supabase.ts

import { supabase, isSupabaseConfigured } from './supabase'
import { AuthAPI } from './auth'
import { SupabaseExpensesAPI } from './supabase-expenses'

async function testSupabaseSetup() {
  console.log('🔍 Testing Supabase Setup...\n')

  // Test 1: Configuration
  console.log('1. Configuration Check:')
  console.log('   Supabase configured:', isSupabaseConfigured())
  console.log('   Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set')
  console.log('   Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set')
  console.log('')

  if (!isSupabaseConfigured()) {
    console.log('⚠️  Supabase not configured. Please set up Supabase to use this application.')
    console.log('   To configure Supabase:')
    console.log('   1. Copy .env.example to .env.local')
    console.log('   2. Add your Supabase URL and API key')
    console.log('   3. Run this test again')
    console.log('')
    return
  }

  try {
    // Test 2: Database Connection
    console.log('2. Database Connection:')
    const { data, error } = await supabase.from('expenses').select('count').limit(1)
    
    if (error) {
      console.log('   ❌ Database connection failed:', error.message)
      console.log('   Make sure you have created the expenses table in Supabase')
    } else {
      console.log('   ✅ Database connection successful')
    }
    console.log('')

    // Test 3: Auth API
    console.log('3. Authentication API:')
    const authAPI = AuthAPI.getInstance()
    
    try {
      const isAuth = await authAPI.isAuthenticated()
      console.log('   ✅ Auth check successful (authenticated:', isAuth, ')')
    } catch (authError) {
      console.log('   ❌ Auth check failed:', authError)
    }
    console.log('')

    // Test 4: Expenses API (without auth)
    console.log('4. Expenses API:')
    const expensesAPI = new SupabaseExpensesAPI()
    
    try {
      // This should fail since we're not authenticated
      await expensesAPI.getExpenses()
      console.log('   ⚠️  Unexpectedly succeeded - this should require auth')
    } catch (expError) {
      if (expError instanceof Error && expError.message.includes('Authentication required')) {
        console.log('   ✅ Auth protection working correctly')
      } else {
        console.log('   ❌ Unexpected error:', expError instanceof Error ? expError.message : String(expError))
      }
    }
    console.log('')

    console.log('🎉 Supabase setup test completed!')
    console.log('')
    console.log('Next Steps:')
    console.log('1. Create a test user account in your app')
    console.log('2. Try creating/viewing expenses')
    console.log('3. Check real-time updates by opening multiple browser tabs')

  } catch (error) {
    console.log('❌ Test failed with error:', error)
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSupabaseSetup()
}

export { testSupabaseSetup }