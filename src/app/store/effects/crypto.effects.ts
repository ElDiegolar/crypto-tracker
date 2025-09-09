import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom, switchMap, tap, delay, debounceTime } from 'rxjs/operators';

import { CryptoService } from '../../services/crypto.service';
import * as CryptoActions from '../actions/crypto.actions';
import { AppState } from '../state/crypto.state';
import { selectFavoriteIds } from '../selectors/crypto.selectors';

@Injectable()
export class CryptoEffects {

  constructor(
    private actions$: Actions,
    private cryptoService: CryptoService,
    private store: Store<AppState>
  ) {}

  // Load cryptocurrencies
  loadCryptos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CryptoActions.loadCryptos),
      exhaustMap(() =>
        this.cryptoService.getCryptos().pipe(
          map(cryptos => CryptoActions.loadCryptosSuccess({ cryptos })),
          catchError(error => of(CryptoActions.loadCryptosFailure({ 
            error: error.message || 'Failed to load cryptocurrencies' 
          })))
        )
      )
    )
  );

  // Search cryptocurrencies
  searchCryptos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CryptoActions.searchCryptos),
      switchMap(({ query }) => {
        if (!query || query.length < 2) {
          return of(CryptoActions.searchCryptosSuccess({ results: [] }));
        }
        
        return this.cryptoService.searchCryptos(query).pipe(
          map(response => CryptoActions.searchCryptosSuccess({ 
            results: response.coins.slice(0, 20) 
          })),
          catchError(error => of(CryptoActions.searchCryptosFailure({ 
            error: error.message || 'Failed to search cryptocurrencies' 
          })))
        );
      })
    )
  );

  // Load favorite details
  loadFavoriteDetails$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CryptoActions.loadFavoriteDetails),
    withLatestFrom(this.store.select(selectFavoriteIds)),
    exhaustMap(([action, favoriteIds]) => {
      if (!favoriteIds.length) {
        return of(CryptoActions.loadFavoriteDetailsSuccess({ favorites: [] }));
      }
      return this.cryptoService.getCryptoDetails(favoriteIds).pipe(
        withLatestFrom(this.store.select(state => state.crypto.favorites)),
        map(([details, currentFavorites]) => {
          console.log('API returned details:', details);
          console.log('Current favorites before merge:', currentFavorites);
          // Merge current favorites with fresh data
          const updatedFavorites = currentFavorites.map(favorite => {
            const detail = details.find(d => d.id === favorite.id);
            return detail ? { 
              ...favorite, 
              current_price: detail.current_price,
              price_change_percentage_24h: detail.price_change_percentage_24h,
              image: detail.image
            } : favorite;
          });
          console.log('Updated favorites after merge:', updatedFavorites);
          return CryptoActions.loadFavoriteDetailsSuccess({ 
            favorites: updatedFavorites 
          });
        }),
        catchError(error => of(CryptoActions.loadFavoriteDetailsFailure({ 
          error: error.message || 'Failed to load favorite details' 
        })))
      );
    })
  )
);

  // Save favorites to localStorage - FIXED with debounce
saveFavorites$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CryptoActions.addFavorite, CryptoActions.removeFavorite),
    debounceTime(500),
    withLatestFrom(this.store.select(state => state.crypto.favorites)),
    tap(([action, favorites]) => {
      // Debugging: Log action and favorites before saving
      console.log('SaveFavorites Effect Triggered:', action);
      console.log('Favorites before saving:', favorites);

      // Only store essential fields and ensure uniqueness
      const minimalFavorites = favorites
        .filter((fav, idx, arr) => arr.findIndex(f => f.id === fav.id) === idx)
        .map(fav => ({
          id: fav.id,
          name: fav.name,
          symbol: fav.symbol,
          image: fav.image,
        }));

      // Debugging: Log minimalFavorites before serialization
      console.log('Minimal favorites to be saved:', minimalFavorites);

      try {
        localStorage.setItem('crypto-favorites', JSON.stringify(minimalFavorites));
        // Debugging: Confirm save
        console.log('Favorites saved to localStorage.');
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    })
  ),
  { dispatch: false }
);

  // Save visited state to localStorage
  saveVisited$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CryptoActions.setVisited),
      tap(() => {
        console.log('Saving visited state to localStorage');
        try {
          localStorage.setItem('crypto-has-visited', 'true');
        } catch (error) {
          console.error('Failed to save visited state:', error);
        }
      })
    ),
    { dispatch: false }
  );
}