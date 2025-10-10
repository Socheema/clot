import { createClient } from '@supabase/supabase-js'

// Load Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define your buckets (adjust names if different)
const CATEGORY_BUCKET = 'categories_images'
const PRODUCT_BUCKET = 'product_images'

// Helper to build full image URL
function getPublicUrl(bucket: string, path?: string | null) {
  if (!path) return null
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

// -------------------- CATEGORY FUNCTIONS --------------------

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*')
  if (error) throw error
   console.log('Raw category data:', data)

  // Attach full public image URL
  return data.map((cat) => ({
    ...cat,
    image: getPublicUrl(CATEGORY_BUCKET, cat.image_url),
  }))
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single()

  if (error) return null
  return {
    ...data,
    image: getPublicUrl(CATEGORY_BUCKET, data.image_url),
  }
}

// -------------------- PRODUCT FUNCTIONS --------------------

export async function getProductsByCategory(slug: string) {
  const { data, error } = await supabase.from('products').select('*').eq('category_slug', slug)

  if (error) return []

  return data.map((product) => ({
    ...product,
    image: getPublicUrl(PRODUCT_BUCKET, product.image_url),
  }))
}
export async function getBestSellingProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) return []
  return data.map((product) => ({ ...product, image: getPublicUrl(PRODUCT_BUCKET, product.image_url) }))
}


