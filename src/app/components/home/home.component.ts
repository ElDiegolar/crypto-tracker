import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { AppState } from '../../store/state/crypto.state';
import * as CryptoActions from '../../store/actions/crypto.actions';
import * as CryptoSelectors from '../../store/selectors/crypto.selectors';
import { Crypto, CryptoSearchResult, FavoriteCrypto } from '../../models/crypto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Observables
  cryptos$ = this.store.select(CryptoSelectors.selectCryptosWithFavoriteStatus);
  favorites$ = this.store.select(CryptoSelectors.selectFavorites);
  searchResults$ = this.store.select(CryptoSelectors.selectSearchResultsWithFavoriteStatus);
  loading$ = this.store.select(CryptoSelectors.selectLoading);
  error$ = this.store.select(CryptoSelectors.selectError);
  hasVisited$ = this.store.select(CryptoSelectors.selectHasVisited);
  shouldShowFavorites$ = this.store.select(CryptoSelectors.selectShouldShowFavorites);
  hasFavorites$ = this.store.select(CryptoSelectors.selectHasFavorites);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // Load initial state
    this.store.dispatch(CryptoActions.loadInitialState());

    // Check if we should load cryptos or favorites
    this.shouldShowFavorites$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(shouldShowFavorites => {
      if (shouldShowFavorites) {
        this.store.dispatch(CryptoActions.loadFavoriteDetails());
        this.startAutoRefresh();
      } else {
        this.store.dispatch(CryptoActions.loadCryptos());
      }
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

  onToggleFavorite(crypto: Crypto | CryptoSearchResult): void {
    const favoriteData: FavoriteCrypto = {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      image: 'large' in crypto ? crypto.large : crypto.image
    };

    // Get current favorite IDs synchronously using take(1)
    this.store.select(CryptoSelectors.selectFavoriteIds).pipe(
      take(1) // FIXED: Only take the current value, don't subscribe
    ).subscribe(favoriteIds => {
      if (favoriteIds.includes(crypto.id)) {
        console.log('Removing favorite:', crypto.name);
        this.store.dispatch(CryptoActions.removeFavorite({ cryptoId: crypto.id }));
      } else {
        console.log('Adding favorite:', crypto.name);
        this.store.dispatch(CryptoActions.addFavorite({ crypto: favoriteData }));
        // Mark as visited when adding first favorite
        this.store.dispatch(CryptoActions.setVisited());
      }
    });
  }

  onRetry(): void {
    this.store.dispatch(CryptoActions.loadCryptos());
  }

  onClearError(): void {
    this.store.dispatch(CryptoActions.clearError());
  }

  trackByCryptoId(index: number, crypto: any): string {
    return crypto.id;
  }

  private startAutoRefresh(): void {
    // Refresh favorites every 30 seconds
    interval(30000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(CryptoActions.loadFavoriteDetails());
    });
  }
}