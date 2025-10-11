import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PRODUCT_BUCKET = 'product_images';

// Helper to build full image URL
function getPublicUrl(bucket: string, path?: string | null) {
  if (!path) return '/products/shirt-1.png';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path.trim()}`;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') ?? '';
    const onSale = url.searchParams.get('onSale') === '1';
    const freeShipping = url.searchParams.get('freeShipping') === '1';
    const gender = url.searchParams.get('gender') ?? '';
    const sort = url.searchParams.get('sort') ?? 'relevance';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');

    // Log query parameters for debugging
    console.log('API Query Params:', { q, onSale, freeShipping, gender, sort, minPrice, maxPrice });

    // Build base query
    let query = supabase
      .from('products')
      .select('id, name, description, price, discounted_price, image_url, images, gender, free_shipping, created_at, "onSale"');

    // Full-text search
    if (q.trim()) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // On sale filter
    if (onSale) {
      query = query.not('discounted_price', 'is', null).gt('discounted_price', 0);
    }

    // Free shipping filter
    if (freeShipping) {
      query = query.eq('free_shipping', true);
    }

    // Gender filter (case-insensitive)
    if (gender) {
      query = query.ilike('gender', gender.toLowerCase());
    }

    // Price filters - Use COALESCE to handle discounted_price
    if (minPrice) {
      const min = Number(minPrice);
      // Filter by the effective price (discounted_price if available, otherwise price)
      query = query.gte('price', min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      // Filter by the effective price (discounted_price if available, otherwise price)
      query = query.lte('price', max);
    }

    // Apply sorting BEFORE executing the query
    switch (sort) {
      case 'price_asc':
      case 'price-low-high':
        // Sort by price ascending
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
      case 'price-high-low':
        // Sort by price descending
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'relevance':
      case 'recommended':
      default:
        query = query.order('id', { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log raw data for debugging
    console.log('Supabase Raw Data Count:', data?.length);
    console.log('First 3 products:', data?.slice(0, 3));

    // Transform data
    const results = (data ?? []).map(product => {
      let imageUrl = product.image_url || product.images?.[0] || null;
      if (imageUrl && typeof imageUrl === 'string') {
        imageUrl = getPublicUrl(PRODUCT_BUCKET, imageUrl);
      } else {
        imageUrl = '/products/shirt-1.png';
      }

      // Calculate display price correctly
      const displayPrice = product.discounted_price && product.discounted_price > 0
        ? product.discounted_price
        : product.price;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discounted_price: product.discounted_price,
        image_url: imageUrl,
        image: imageUrl,
        onSale: Boolean(product.discounted_price && product.discounted_price > 0),
        displayPrice,
        free_shipping: product.free_shipping,
        gender: product.gender?.toLowerCase() || null,
        created_at: product.created_at,
      };
    });

    // Post-processing filter for price range if needed (for discounted prices)
    let filteredResults = results;
    if (minPrice || maxPrice) {
      filteredResults = results.filter(product => {
        const effectivePrice = product.discounted_price || product.price;
        if (minPrice && effectivePrice < Number(minPrice)) return false;
        if (maxPrice && effectivePrice > Number(maxPrice)) return false;
        return true;
      });
    }

    // Post-processing sort for price if needed (for discounted prices)
    if (sort === 'price_asc' || sort === 'price-low-high') {
      filteredResults.sort((a, b) => {
        const priceA = a.discounted_price || a.price;
        const priceB = b.discounted_price || b.price;
        return priceA - priceB;
      });
    } else if (sort === 'price_desc' || sort === 'price-high-low') {
      filteredResults.sort((a, b) => {
        const priceA = a.discounted_price || a.price;
        const priceB = b.discounted_price || b.price;
        return priceB - priceA;
      });
    }

    // Log transformed results
    console.log('API Transformed Results Count:', filteredResults.length);
    console.log('Sort applied:', sort);
    console.log('Gender filter:', gender);

    return NextResponse.json({
      results: filteredResults,
      count: filteredResults.length,
      filters: { query: q, onSale, freeShipping, gender, sort, minPrice, maxPrice },
    });

  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
