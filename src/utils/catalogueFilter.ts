import { Category, Product, SortOption } from '../types/store';

export interface FilterCriteria {
  category: Category | 'All';
  query: string;
  sort: SortOption;
  onlyNewArrivals?: boolean;
}

export function filterAndSortProducts(
  products: readonly Product[],
  criteria: FilterCriteria
): Product[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (criteria.onlyNewArrivals && !product.isNewArrival) {
      return false;
    }

    if (criteria.category !== 'All' && product.category !== criteria.category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      product.name,
      product.category,
      product.description,
      product.fabricNote,
      ...product.colours.map((c) => c.name),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const sorted = [...filtered];

  switch (criteria.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.priceNgn - b.priceNgn || b.createdAtOrder - a.createdAtOrder);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.priceNgn - a.priceNgn || b.createdAtOrder - a.createdAtOrder);
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => b.createdAtOrder - a.createdAtOrder);
      break;
  }

  return sorted;
}
