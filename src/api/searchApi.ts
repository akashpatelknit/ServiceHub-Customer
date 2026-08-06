import { apiGet } from './client';
import type { SearchResponse } from './types';

export interface SearchParams {
  limit?: number;
  /** Raises the per-group cap for the full results page instead of the suggestion-dropdown cap. */
  full?: boolean;
}

export const searchApi = {
  search: (q: string, params?: SearchParams) =>
    apiGet<SearchResponse>('/search', { params: { q, limit: params?.limit, full: params?.full } }),
};
