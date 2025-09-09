import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { AppState } from '../../store/state/crypto.state';
import * as CryptoActions from '../../store/actions/crypto.actions';
import * as CryptoSelectors from '../../store/selectors/crypto.selectors';
import { Crypto, CryptoSearchResult, FavoriteCrypto } from '../../models/crypto.model';

type CryptoCardData = Crypto | CryptoSearchResult | FavoriteCrypto;

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})

export class FavoritesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  favorites$ = this.store.select(state => state.crypto.favorites)
  searchResults$ = this.store.select(CryptoSelectors.selectSearchResultsWithFavoriteStatus);
  loading$ = this.store.select(CryptoSelectors.selectLoading);

  hasSearchResults: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // Track search results availability
    this.searchResults$.pipe(takeUntil(this.destroy$)).subscribe(results => {
      this.hasSearchResults = !!results && results.length > 0;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(query: string): void {
    if (query.trim()) {
      this.store.dispatch(CryptoActions.searchCryptos({ query }));
    } else {
      this.store.dispatch(CryptoActions.clearSearchResults());
    }
  }

  onClearSearch(): void {
    this.store.dispatch(CryptoActions.clearSearchResults());
  }

onToggleFavorite(crypto: CryptoCardData): void {
 
  const favoriteData: FavoriteCrypto = {
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    image: 'large' in crypto ? crypto.large : crypto.image
  };

  this.store.select(CryptoSelectors.selectFavoriteIds)
    .pipe(take(1))
    .subscribe(favoriteIds => {
      if (favoriteIds.includes(crypto.id)) {
        this.store.dispatch(CryptoActions.removeFavorite({ cryptoId: crypto.id }));
      } else {
        this.store.dispatch(CryptoActions.addFavorite({ crypto: favoriteData }));
      }
    });
}

  onRemoveFavorite(cryptoId: string): void {
    this.store.dispatch(CryptoActions.removeFavorite({ cryptoId }));
  }

  trackByCryptoId(index: number, crypto: any): string {
    return crypto.id;
  }
}
