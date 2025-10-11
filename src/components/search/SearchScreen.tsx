'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { debounce } from 'lodash-es';
import SearchBar from './SearchBar';
import SearchCategoryList from './SearchCategoryList';
import ProductCard from '../product/ProductCard';
import { ChevronDown, Check, X, Funnel } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

interface Product {
  id: number | string;
  name: string;
  price: number;
  discounted_price?: number | null;
  image: string;
  image_url?: string;
  onSale: boolean;
  freeShipping: boolean;
  gender: string | null;
  created_at?: string;
}

interface Props {
  categories: Category[];
  useApiSearch?: boolean;
}

// SearchInput Component
const SearchInput = ({
  query,
  setQuery,
  onSearch,
}: {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (e: React.FormEvent) => void;
}) => <SearchBar query={query} setQuery={setQuery} onSearch={onSearch} />;

// FilterButton Component
const FilterButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-2 py-1 rounded-full whitespace-nowrap ${
      isActive ? 'bg-primary' : 'bg-brand-3'
    }`}
  >
    <span className="text-sm capitalize">{label}</span>
    <ChevronDown size={16} />
  </button>
);

// FilterCountBadge Component
const FilterCountBadge = ({ count }: { count: number }) => (
  <button className="flex items-center gap-1 px-2 py-1 bg-brand-3 rounded-full whitespace-nowrap relative">
    <Funnel size={16} />
    {count > 0 && (
      <span className="text-white/50 text-[10px] flex items-center justify-center font-semibold">
        {count}
      </span>
    )}
  </button>
);

// ProductGrid Component
const ProductGrid = ({
  filteredProducts,
  noResults,
  isLoading,
  error,
  setQuery,
  clearAllFilters,
}: {
  filteredProducts: Product[];
  noResults: boolean;
  isLoading: boolean;
  error: Error | null;
  setQuery: (q: string) => void;
  clearAllFilters: () => void;
}) => (
  <>
    {isLoading && (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )}
    {error && (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="text-red-400 mb-4">
          <X size={48} className="mx-auto mb-2" />
          <p className="font-medium">Something went wrong</p>
        </div>
        <p className="text-sm text-gray-400 mb-6">{error.message || 'Failed to load products'}</p>
        <button
          onClick={clearAllFilters}
          className="bg-primary text-brand rounded-full px-6 py-2 font-semibold"
        >
          Try Again
        </button>
      </div>
    )}
    {!isLoading && !error && noResults && (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="relative w-24 h-24 mb-6">
          <Image
            src="/icons/search.png"
            alt="No results"
            fill
            className="object-contain opacity-90"
          />
        </div>
        <h2 className="text-lg font-medium mb-2">
          Sorry, we couldn't find any matching result for your search.
        </h2>
        <p className="text-sm text-gray-400 mb-6">Try searching with different keywords.</p>
        <button
          onClick={() => setQuery('')}
          className="bg-primary text-brand rounded-full px-6 py-2 font-semibold"
        >
          Try Again
        </button>
      </div>
    )}
    {!isLoading && !error && filteredProducts.length > 0 && (
      <>
        <p className="text-gray-400 text-sm mb-4">{filteredProducts.length} Results Found</p>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={String(p.id)}
              name={p.name}
              price={p.price}
              image={p.image}
              discounted_price={p.discounted_price ?? undefined}
            />
          ))}
        </div>
      </>
    )}
  </>
);

// FilterModal Component
const FilterModal = ({
  activeModal,
  clearFilters,
  closeModal,
  children,
}: {
  activeModal: string | null;
  clearFilters: () => void;
  closeModal: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-end z-50">
    <div className="bg-brand w-full rounded-t-3xl p-6 animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-brand z-10">
        <button onClick={clearFilters} className="text-primary text-sm font-medium">
          Clear
        </button>
        <h2 className="text-xl font-semibold capitalize">
          {activeModal === 'sort' ? 'Sort by' : activeModal}
        </h2>
        <button onClick={closeModal}>
          <X size={24} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// SortModalContent Component
const SortModalContent = ({
  tempFilters,
  setTempFilters,
  setFilters,
  closeModal,
}: {
  tempFilters: any;
  setTempFilters: (filters: any) => void;
  setFilters: (filters: any) => void;
  closeModal: () => void;
}) => (
  <div className="space-y-3">
    {[
      { value: 'recommended', label: 'Recommended' },
      { value: 'newest', label: 'Newest' },
      { value: 'price-low-high', label: 'Lowest - Highest Price' },
      { value: 'price-high-low', label: 'Highest - Lowest Price' },
    ].map((option) => (
      <button
        key={option.value}
        onClick={() => {
          console.log('Selected Sort:', option.value);
          const newFilters = { ...tempFilters, sortBy: option.value };
          setTempFilters(newFilters);
          setFilters(newFilters);
          closeModal();
        }}
        className={`w-full flex items-center justify-between p-4 rounded-2xl ${
          tempFilters.sortBy === option.value ? 'bg-primary' : 'bg-brand-3'
        }`}
      >
        <span>{option.label}</span>
        {tempFilters.sortBy === option.value && <Check size={20} />}
      </button>
    ))}
  </div>
);

// GenderModalContent Component
const GenderModalContent = ({
  tempFilters,
  setTempFilters,
  setFilters,
  closeModal,
}: {
  tempFilters: any;
  setTempFilters: (filters: any) => void;
  setFilters: (filters: any) => void;
  closeModal: () => void;
}) => (
  <div className="space-y-3">
    {['men', 'women', 'kids'].map((gender) => (
      <button
        key={gender}
        onClick={() => {
          console.log('Selected Gender:', gender);
          const newFilters = { ...tempFilters, gender };
          setTempFilters(newFilters);
          setFilters(newFilters);
          closeModal();
        }}
        className={`w-full flex items-center justify-between p-4 rounded-2xl capitalize ${
          tempFilters.gender === gender ? 'bg-primary' : 'bg-brand-3'
        }`}
      >
        <span>{gender}</span>
        {tempFilters.gender === gender && <Check size={20} />}
      </button>
    ))}
  </div>
);

// DealsModalContent Component
const DealsModalContent = ({
  tempFilters,
  setTempFilters,
  applyFilters,
}: {
  tempFilters: any;
  setTempFilters: (filters: any) => void;
  applyFilters: () => void;
}) => (
  <div className="space-y-3">
    <button
      onClick={() => setTempFilters({ ...tempFilters, onSale: !tempFilters.onSale })}
      className={`w-full flex items-center justify-between p-4 rounded-2xl ${
        tempFilters.onSale ? 'bg-primary' : 'bg-brand-3'
      }`}
    >
      <span>On sale</span>
      {tempFilters.onSale && <Check size={20} />}
    </button>
    <button
      onClick={() => setTempFilters({ ...tempFilters, freeShipping: !tempFilters.freeShipping })}
      className={`w-full flex items-center justify-between p-4 rounded-2xl ${
        tempFilters.freeShipping ? 'bg-primary' : 'bg-brand-3'
      }`}
    >
      <span>Free Shipping Eligible</span>
      {tempFilters.freeShipping && <Check size={20} />}
    </button>
    <button onClick={applyFilters} className="w-full bg-primary p-4 rounded-2xl mt-6 font-semibold">
      Apply
    </button>
  </div>
);

// PriceModalContent Component
const PriceModalContent = ({
  tempFilters,
  setTempFilters,
  applyFilters,
}: {
  tempFilters: any;
  setTempFilters: (filters: any) => void;
  applyFilters: () => void;
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-gray-400 text-sm mb-2">Min</label>
      <input
        type="number"
        value={tempFilters.minPrice}
        onChange={(e) => setTempFilters({ ...tempFilters, minPrice: e.target.value })}
        placeholder="0"
        className="w-full bg-brand-3 rounded-2xl p-4 text-white"
      />
    </div>
    <div>
      <label className="block text-gray-400 text-sm mb-2">Max</label>
      <input
        type="number"
        value={tempFilters.maxPrice}
        onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
        placeholder="1000"
        className="w-full bg-brand-3 rounded-2xl p-4 text-white"
      />
    </div>
    <button onClick={applyFilters} className="w-full bg-primary p-4 rounded-2xl mt-4 font-semibold">
      Apply
    </button>
  </div>
);

// Main SearchScreen Component
export default function SearchScreen({ categories, useApiSearch = false }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const initialQuery = searchParams?.get('query') || searchParams?.get('q') || '';
  const [query, setQuery] = useState<string>(initialQuery);
  const [filters, setFilters] = useState({
    onSale: searchParams?.get('onSale') === '1',
    freeShipping: searchParams?.get('freeShipping') === '1',
    gender: searchParams?.get('gender') || null,
    sortBy: searchParams?.get('sortBy') || searchParams?.get('sort') || 'recommended',
    minPrice: searchParams?.get('minPrice') || '',
    maxPrice: searchParams?.get('maxPrice') || '',
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Helper function to check if any filters are active
  const hasActiveFilters = () => {
    return (
      query.trim() !== '' ||
      filters.onSale ||
      filters.freeShipping ||
      filters.gender !== null ||
      filters.sortBy !== 'recommended' ||
      filters.minPrice !== '' ||
      filters.maxPrice !== ''
    );
  };

  // Convert sortBy value to API format
  const getSortParam = (sortBy: string) => {
    switch (sortBy) {
      case 'price-low-high':
        return 'price_asc';
      case 'price-high-low':
        return 'price_desc';
      case 'newest':
        return 'newest';
      case 'recommended':
      default:
        return 'relevance';
    }
  };

  // API Search with Tanstack Query
  const fetchResults = async () => {
    if (!useApiSearch) return [];

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.onSale) params.set('onSale', '1');
    if (filters.freeShipping) params.set('freeShipping', '1');
    if (filters.gender) params.set('gender', filters.gender.toLowerCase());

    const sortParam = getSortParam(filters.sortBy);
    if (sortParam !== 'relevance') params.set('sort', sortParam);

    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

    console.log('Fetching with params:', params.toString());
    console.log('Current filters:', filters);

    const res = await fetch(`/api/search?${params.toString()}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch products');
    }
    const json = await res.json();
    console.log('API Response:', json);
    console.log('API Results Count:', json.results?.length);

    return (json.results || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      discounted_price: item.discounted_price,
      image: item.image_url || item.image || '/products/shirt-1.png',
      image_url: item.image_url || item.image || '/products/shirt-1.png',
      onSale: Boolean(item.onSale), // Use onSale from database
      freeShipping: Boolean(item.free_shipping),
      gender: item.gender || null,
      created_at: item.created_at || null,
    })) as Product[];
  };

  const {
    data: apiProducts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['search', query, filters],
    queryFn: fetchResults,
    enabled: useApiSearch && hasActiveFilters(),
    staleTime: 1000 * 15,
    retry: 2,
  });

  // Debug effect
  useEffect(() => {
    console.log('=== Search Screen State ===');
    console.log('Current filters:', filters);
    console.log('Has active filters:', hasActiveFilters());
    console.log('API Products count:', apiProducts.length);
    console.log('Is loading:', isLoading);
    console.log('Use API Search:', useApiSearch);
  }, [filters, apiProducts, isLoading, useApiSearch]);

  // Debounced URL update
  const debouncedUpdateURL = useMemo(
    () =>
      debounce(() => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (filters.onSale) params.set('onSale', '1');
        if (filters.freeShipping) params.set('freeShipping', '1');
        if (filters.gender) params.set('gender', filters.gender.toLowerCase());
        if (filters.sortBy && filters.sortBy !== 'recommended') {
          params.set('sort', getSortParam(filters.sortBy));
        }
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        console.log('Updating URL with params:', params.toString());
        router.push(`/search?${params.toString()}`, { scroll: false });
      }, 300),
    [query, filters, router],
  );

  // Update URL when filters or query change
  useEffect(() => {
    debouncedUpdateURL();
  }, [debouncedUpdateURL]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Search submitted:', query);
    }
  };

  const openModal = (modalName: string) => {
    setTempFilters(filters);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const applyFilters = () => {
    console.log('Applying filters:', tempFilters);
    setFilters(tempFilters);
    closeModal();
  };

  const clearFilters = () => {
    const clearedFilters = {
      onSale: false,
      freeShipping: false,
      gender: null,
      sortBy: 'recommended',
      minPrice: '',
      maxPrice: '',
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  const clearAllFilters = () => {
    clearFilters();
    setQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.onSale) count++;
    if (filters.freeShipping) count++;
    if (filters.sortBy !== 'recommended') count++;
    if (filters.gender !== null) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    return count;
  };

  // Use API products directly when API search is enabled
  const filteredProducts = useMemo(() => {
    if (useApiSearch) {
      console.log('Using API results:', apiProducts.length);
      return apiProducts;
    }

    // Client-side filtering fallback (if not using API)
    if (!hasActiveFilters()) return [];

    let result = [...apiProducts];

    if (query.trim() !== '') {
      result = result.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (filters.gender) {
      result = result.filter((p) => p.gender && p.gender.toLowerCase() === filters.gender?.toLowerCase());
    }
    if (filters.onSale) {
      result = result.filter((p) => p.onSale);
    }
    if (filters.freeShipping) {
      result = result.filter((p) => p.freeShipping);
    }
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id);
          const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id);
          return dateB - dateA;
        });
        break;
      case 'price-low-high':
        result.sort((a, b) => (a.discounted_price || a.price) - (b.discounted_price || b.price));
        break;
      case 'price-high-low':
        result.sort((a, b) => (b.discounted_price || b.price) - (a.discounted_price || a.price));
        break;
      default:
        break;
    }

    return result;
  }, [apiProducts, filters, query, useApiSearch]);

  const noResults = hasActiveFilters() && filteredProducts.length === 0 && !isLoading;

  return (
    <div className="bg-brand text-white px-4 py-6 h-[calc(100vh-72px)] flex flex-col gap-2">
      <div className="sticky top-0 bg-brand z-10 pt-4">
        <SearchInput query={query} setQuery={setQuery} onSearch={handleSearch} />
        <div className="flex gap-2 mb-4 overflow-x-auto mt-2 snap-mandatory snap-x no-scrollbar items-center">
          <FilterCountBadge count={getActiveFilterCount()} />
          <FilterButton
            label="On Sale"
            isActive={filters.onSale || filters.freeShipping}
            onClick={() => openModal('deals')}
          />
          <FilterButton
            label="Price"
            isActive={filters.minPrice !== '' || filters.maxPrice !== ''}
            onClick={() => openModal('price')}
          />
          <FilterButton
            label="Sort by"
            isActive={filters.sortBy !== 'recommended'}
            onClick={() => openModal('sort')}
          />
          <FilterButton
            label={filters.gender || 'Gender'}
            isActive={filters.gender !== null}
            onClick={() => openModal('gender')}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-72px-120px)] overflow-y-auto no-scrollbar snap-y snap-mandatory">
        {!query && !activeModal && !hasActiveFilters() && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Shop by Categories</h2>
            <SearchCategoryList categories={categories} />
          </div>
        )}
        <ProductGrid
          filteredProducts={filteredProducts}
          noResults={noResults}
          isLoading={isLoading && useApiSearch}
          error={error}
          setQuery={setQuery}
          clearAllFilters={clearAllFilters}
        />
      </div>
      {activeModal && (
        <FilterModal activeModal={activeModal} clearFilters={clearFilters} closeModal={closeModal}>
          {activeModal === 'sort' && (
            <SortModalContent
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              setFilters={setFilters}
              closeModal={closeModal}
            />
          )}
          {activeModal === 'gender' && (
            <GenderModalContent
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              setFilters={setFilters}
              closeModal={closeModal}
            />
          )}
          {activeModal === 'deals' && (
            <DealsModalContent
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              applyFilters={applyFilters}
            />
          )}
          {activeModal === 'price' && (
            <PriceModalContent
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              applyFilters={applyFilters}
            />
          )}
        </FilterModal>
      )}
    </div>
  );
}
