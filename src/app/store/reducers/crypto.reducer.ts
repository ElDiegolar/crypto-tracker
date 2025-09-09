import { createReducer, on } from '@ngrx/store';
import { CryptoState, initialCryptoState } from '../state/crypto.state';
import * as CryptoActions from '../actions/crypto.actions';

export const cryptoReducer = createReducer(
  initialCryptoState,

  // Load Cryptos
  on(CryptoActions.loadCryptos, (state): CryptoState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CryptoActions.loadCryptosSuccess, (state, { cryptos }): CryptoState => ({
    ...state,
    cryptos,
    loading: false,
    error: null,
    lastUpdated: Date.now()
  })),

  on(CryptoActions.loadCryptosFailure, (state, { error }): CryptoState => ({
    ...state,
    loading: false,
    error
  })),

  // Search Cryptos
  on(CryptoActions.searchCryptos, (state): CryptoState => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CryptoActions.searchCryptosSuccess, (state, { results }): CryptoState => ({
    ...state,
    searchResults: results,
    loading: false,
    error: null
  })),

  on(CryptoActions.searchCryptosFailure, (state, { error }): CryptoState => ({
    ...state,
    loading: false,
    error
  })),

  on(CryptoActions.clearSearchResults, (state): CryptoState => ({
    ...state,
    searchResults: []
  })),

  // Favorites - FIXED
  on(CryptoActions.addFavorite, (state, { crypto }): CryptoState => {
  // Only add if not already present
  if (state.favorites.some(fav => fav.id === crypto.id)) {
    return state;
  }
  return { ...state, favorites: [...state.favorites, crypto] };
}),
on(CryptoActions.removeFavorite, (state, { cryptoId }): CryptoState => {
  // Only remove if present
  if (!state.favorites.some(fav => fav.id === cryptoId)) {
    return state;
  }
  return { ...state, favorites: state.favorites.filter(fav => fav.id !== cryptoId) };
}),

  on(CryptoActions.loadFavoriteDetailsSuccess, (state, { favorites: details }): CryptoState => ({
  ...state,
  favorites: state.favorites.map(fav => {
    const detail = details.find(d => d.id === fav.id);
    return detail ? { ...fav, ...detail } : fav;
  }),
  loading: false,
  error: null,
  lastUpdated: Date.now()
})),


  on(CryptoActions.loadFavoriteDetailsFailure, (state, { error }): CryptoState => ({
    ...state,
    loading: false,
    error
  })),

  // App State
  on(CryptoActions.setVisited, (state): CryptoState => ({
    ...state,
    hasVisited: true
  })),

  on(CryptoActions.loadInitialState, (state): CryptoState => {
    console.log('Loading initial state from localStorage');
    const storedFavorites = localStorage.getItem('crypto-favorites');
    const storedHasVisited = localStorage.getItem('crypto-has-visited');
    
    return {
      ...state,
      favorites: storedFavorites ? JSON.parse(storedFavorites) : [],
      hasVisited: storedHasVisited === 'true'
    };
  }),

  // Error Handling
  on(CryptoActions.clearError, (state): CryptoState => ({
    ...state,
    error: null
  }))
);