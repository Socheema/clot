import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const REVIEWER_BUCKET = 'reviewer_images'

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
      .from('reviews')
      .select('*')
      .eq('product_id', params.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform reviews to include full image URLs
    const reviews = (data || []).map((review) => ({
      ...review,
      reviewer_image_url: getPublicUrl(REVIEWER_BUCKET, review.reviewer_image_url),
    }))

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { reviewer_name, reviewer_image_url, review_text, rating } = body

    if (!reviewer_name || !review_text || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: parseInt(params.id),
        reviewer_name,
        reviewer_image_url,
        review_text,
        rating,
      })
      .select()

    if (error) throw error

    // Transform response to include full image URL
    const review = {
      ...data[0],
      reviewer_image_url: getPublicUrl(REVIEWER_BUCKET, data[0].reviewer_image_url),
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
