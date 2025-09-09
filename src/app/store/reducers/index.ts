import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../state/crypto.state';
import { cryptoReducer } from './crypto.reducer';

export const reducers: ActionReducerMap<AppState> = {
  crypto: cryptoReducer
};

export * from './crypto.reducer';
