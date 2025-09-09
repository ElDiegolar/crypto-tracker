import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Crypto, CryptoSearchResult, FavoriteCrypto } from '../../models/crypto.model';

type CryptoCardData = Crypto | CryptoSearchResult | FavoriteCrypto;

@Component({
  selector: 'app-crypto-card',
  templateUrl: './crypto-card.component.html',
  styleUrls: ['./crypto-card.component.scss']
})
export class CryptoCardComponent {
  @Input() crypto!: CryptoCardData;
  @Input() isFavorite: boolean = false;
  @Input() showToggle: boolean = true;
  @Input() showRemove: boolean = false;
  @Output() toggleFavorite = new EventEmitter<CryptoCardData>();
  @Output() remove = new EventEmitter<string>();

  get hasPrice(): boolean {
    return 'current_price' in this.crypto && this.crypto.current_price !== undefined;
  }

  get currentPrice(): number | undefined {
    return 'current_price' in this.crypto ? this.crypto.current_price : undefined;
  }

  get priceChange(): number {
    return 'price_change_percentage_24h' in this.crypto 
      ? this.crypto.price_change_percentage_24h || 0 
      : 0;
  }
  
  get marketCapRank(): number | null {
  return 'market_cap_rank' in this.crypto && this.crypto.market_cap_rank
    ? this.crypto.market_cap_rank
    : null;
}


  get priceChangeClass(): string {
    return this.priceChange >= 0 ? 'price-up' : 'price-down';
  }

  get priceChangeIcon(): string {
    return this.priceChange >= 0 ? '📈' : '📉';
  }

  get cryptoImage(): string {
    if ('large' in this.crypto) {
      return this.crypto.large;
    }
    return this.crypto.image;
  }

  onToggleFavorite(): void {
    this.toggleFavorite.emit(this.crypto);
  }

  onRemove(): void {
    this.remove.emit(this.crypto.id);
  }

  // ✅ Fallback handler for broken images
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/crypto-fallback.png';
  }
}
