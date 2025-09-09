import { createAction, props } from '@ngrx/store';
import { Crypto, CryptoSearchResult, FavoriteCrypto } from '../../models/crypto.model';

export const loadCryptos = createAction('[Crypto] Load Cryptos');
export const loadCryptosSuccess = createAction('[Crypto] Load Cryptos Success', props<{ cryptos: Crypto[] }>());
export const loadCryptosFailure = createAction('[Crypto] Load Cryptos Failure', props<{ error: string }>());

export const searchCryptos = createAction('[Crypto] Search Cryptos', props<{ query: string }>());
export const searchCryptosSuccess = createAction('[Crypto] Search Cryptos Success', props<{ results: CryptoSearchResult[] }>());
export const searchCryptosFailure = createAction('[Crypto] Search Cryptos Failure', props<{ error: string }>());
export const clearSearchResults = createAction('[Crypto] Clear Search Results');

export const addFavorite = createAction('[Crypto] Add Favorite', props<{ crypto: FavoriteCrypto }>());
export const removeFavorite = createAction('[Crypto] Remove Favorite', props<{ cryptoId: string }>());
export const loadFavoriteDetails = createAction('[Crypto] Load Favorite Details');
export const loadFavoriteDetailsSuccess = createAction('[Crypto] Load Favorite Details Success', props<{ favorites: FavoriteCrypto[] }>());
export const loadFavoriteDetailsFailure = createAction('[Crypto] Load Favorite Details Failure', props<{ error: string }>());

export const setVisited = createAction('[Crypto] Set Visited');
export const loadInitialState = createAction('[Crypto] Load Initial State');
export const clearError = createAction('[Crypto] Clear Error');
