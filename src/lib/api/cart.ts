import { createClient } from '@supabase/supabase-js'
import { CartItem } from '@/types/cart'

// Load Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define your bucket
const PRODUCT_BUCKET = 'product_images'

// Helper to build full image URL
function getPublicUrl(bucket: string, path?: string | null) {
  if (!path) return null
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

// -------------------- CART FUNCTIONS --------------------

/**
 * Get user's cart from database
 */
export async function getUserCart(userId: string) {
  try {
    const { data, error } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No cart found, return empty cart
        return { user_id: userId, items: [], created_at: new Date().toISOString() }
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to fetch user cart:', error)
    return null
  }
}

/**
 * Create or update user's cart in database
 */
export async function saveUserCart(userId: string, items: CartItem[]) {
  try {
    // Check if cart exists
    const { data: existingCart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingCart) {
      // Update existing cart
      const { error } = await supabase
        .from('carts')
        .update({
          items: items,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (error) throw error
    } else {
      // Create new cart
      const { error } = await supabase.from('carts').insert({
        user_id: userId,
        items: items,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to save cart:', error)
    throw error
  }
}

/**
 * Clear user's cart from database
 */
export async function clearUserCart(userId: string) {
  try {
    const { error } = await supabase
      .from('carts')
      .update({
        items: [],
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Failed to clear cart:', error)
    throw error
  }
}

/**
 * Validate cart items - check if products still exist and prices are current
 */
export async function validateCartItems(items: CartItem[]) {
  try {
    if (!items || items.length === 0) return []

    const productIds = items.map((item) => item.product_id)

    // Fetch current product data
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, discounted_price, image_url, in_stock')
      .in('id', productIds)

    if (error) throw error

    // Validate and update cart items with current data
    const validatedItems = items
      .filter((item) => {
        const product = products.find((p) => String(p.id) === String(item.product_id))
        return product && product.in_stock
      })
      .map((item) => {
        const product = products.find((p) => String(p.id) === String(item.product_id))
        if (!product) return item

        return {
          ...item,
          name: product.name,
          price: product.price,
          discounted_price: product.discounted_price,
          image: getPublicUrl(PRODUCT_BUCKET, product.image_url),
          in_stock: product.in_stock,
        }
      })

    return validatedItems
  } catch (error) {
    console.error('Failed to validate cart items:', error)
    return items
  }
}

/**
 * Get product details for cart items
 */
export async function getCartItemsDetails(productIds: (string | number)[]) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, discounted_price, image_url, in_stock')
      .in('id', productIds)

    if (error) throw error

    return data.map((product) => ({
      ...product,
      image: getPublicUrl(PRODUCT_BUCKET, product.image_url),
    }))
  } catch (error) {
    console.error('Failed to fetch cart items details:', error)
    return []
  }
}
