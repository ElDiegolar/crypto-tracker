import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Crypto, CryptoSearchResponse } from '../models/crypto.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  getCryptos(page: number = 1, limit: number = 50): Observable<Crypto[]> {
    const url = `${this.baseUrl}/coins/markets`;
    const params = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit.toString(),
      page: page.toString(),
      sparkline: 'false',
      price_change_percentage: '24h'
    };

    return this.http.get<Crypto[]>(url, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  searchCryptos(query: string): Observable<CryptoSearchResponse> {
    if (!query || query.length < 2) {
      return throwError(() => new Error('Query must be at least 2 characters'));
    }

    const url = `${this.baseUrl}/search`;
    const params = { query };

    return this.http.get<CryptoSearchResponse>(url, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getCryptoDetails(ids: string[]): Observable<Crypto[]> {
    if (!ids.length) {
      return throwError(() => new Error('No IDs provided'));
    }

    const url = `${this.baseUrl}/coins/markets`;
    const params = {
      vs_currency: 'usd',
      ids: ids.join(','),
      order: 'market_cap_desc',
      sparkline: 'false',
      price_change_percentage: '24h'
    };

    return this.http.get<Crypto[]>(url, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 0:
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('CryptoService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
