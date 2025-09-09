import { Crypto, CryptoSearchResult, FavoriteCrypto } from '../../models/crypto.model';

export interface CryptoState {
  cryptos: Crypto[];
  favorites: FavoriteCrypto[];
  searchResults: CryptoSearchResult[];
  loading: boolean;
  error: string | null;
  hasVisited: boolean;
  lastUpdated: number | null;
}

export const initialCryptoState: CryptoState = {
  cryptos: [],
  favorites: [],
  searchResults: [],
  loading: false,
  error: null,
  hasVisited: false,
  lastUpdated: null
};

export interface AppState {
  crypto: CryptoState;
}
