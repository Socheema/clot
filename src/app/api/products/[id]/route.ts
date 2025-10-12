import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const PRODUCT_BUCKET = 'product_images'

function getPublicUrl(bucket: string, path?: string | null) {
  if (!path) return null
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform product data
    const product = {
      ...data,
      image: getPublicUrl(PRODUCT_BUCKET, data.image_url),
      images: [
        getPublicUrl(PRODUCT_BUCKET, data.image_url),
        ...(data.images || []).map((img: string) => getPublicUrl(PRODUCT_BUCKET, img)),
      ].filter(Boolean),
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
