import SearchScreen from '@/components/search/SearchScreen';
import { getCategories } from '@/lib/product';

export default async function SearchPage() {
  const categories = await getCategories();

  return <SearchScreen categories={categories} useApiSearch={true} />;
}

