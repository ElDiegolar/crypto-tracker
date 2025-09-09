export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: string;
  last_updated?: string;
}

export interface CryptoSearchResult {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

export interface CryptoSearchResponse {
  coins: CryptoSearchResult[];
}

export interface FavoriteCrypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price?: number;
  price_change_percentage_24h?: number;
}
