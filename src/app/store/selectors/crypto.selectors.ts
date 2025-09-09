import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CryptoState } from '../state/crypto.state';

export const selectCryptoState = createFeatureSelector<CryptoState>('crypto');

export const selectCryptos = createSelector(selectCryptoState, (state: CryptoState) => state.cryptos);
export const selectFavorites = createSelector(selectCryptoState, (state: CryptoState) => state.favorites);
export const selectSearchResults = createSelector(selectCryptoState, (state: CryptoState) => state.searchResults);
export const selectLoading = createSelector(selectCryptoState, (state: CryptoState) => state.loading);
export const selectError = createSelector(selectCryptoState, (state: CryptoState) => state.error);
export const selectHasVisited = createSelector(selectCryptoState, (state: CryptoState) => state.hasVisited);

export const selectHasFavorites = createSelector(selectFavorites, (favorites) => favorites.length > 0);
export const selectFavoriteIds = createSelector(selectFavorites, (favorites) => favorites.map(fav => fav.id));

export const selectCryptosWithFavoriteStatus = createSelector(
  selectCryptos,
  selectFavoriteIds,
  (cryptos, favoriteIds) => 
    cryptos.map(crypto => ({
      ...crypto,
      isFavorite: favoriteIds.includes(crypto.id)
    }))
);

export const selectSearchResultsWithFavoriteStatus = createSelector(
  selectSearchResults,
  selectFavoriteIds,
  (searchResults, favoriteIds) =>
    searchResults.map(result => ({
      ...result,
      isFavorite: favoriteIds.includes(result.id)
    }))
);

export const selectShouldShowFavorites = createSelector(
  selectHasVisited,
  selectHasFavorites,
  (hasVisited, hasFavorites) => hasVisited && hasFavorites
);
