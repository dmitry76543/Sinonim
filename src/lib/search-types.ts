import type { CategorySlug } from "@/lib/products";

export type SearchAutocompleteProduct = {
  type: "product";
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  artNo?: string;
  href: string;
};

export type SearchAutocompleteCategory = {
  type: "category";
  slug: CategorySlug;
  name: string;
  href: string;
};

export type SearchAutocompleteSuggestion =
  | SearchAutocompleteProduct
  | SearchAutocompleteCategory;

export type SearchAutocompleteResult = {
  products: SearchAutocompleteProduct[];
  categories: SearchAutocompleteCategory[];
};

export function flattenAutocompleteSuggestions(
  result: SearchAutocompleteResult
): SearchAutocompleteSuggestion[] {
  return [...result.categories, ...result.products];
}
