
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') ?? '';
    const onSale = url.searchParams.get('onSale') === '1';
    const gender = url.searchParams.get('gender') ?? ''; 
    const sort = url.searchParams.get('sort') ?? 'relevance';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');

    // Build base query
    let query = supabase.from('products').select('*');

    // Full-text (simple ilike on name + description for demo)
    if (q.trim()) {
      // ilike for case-insensitive partial match
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // on sale (assumes discounted_price is set)
    if (onSale) {
      query = query.gt('discounted_price', 0);
    }

    // gender filter (assumes products.gender text column)
    if (gender) {
      query = query.eq('gender', gender);
    }

    // price filters
    if (minPrice) {
      query = query.gte('price', Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', Number(maxPrice));
    }

    // sorting
    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } // 'relevance' is the fallback (no ordering)

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // return products as-is (client will build full image URLs via your lib or results include image_url)
    return NextResponse.json({ results: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
