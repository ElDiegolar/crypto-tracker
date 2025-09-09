import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CryptoCardComponent } from './components/crypto-card/crypto-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

import { CryptoService } from './services/crypto.service';
import { reducers } from './store/reducers';
import { CryptoEffects } from './store/effects/crypto.effects';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FavoritesComponent,
    CryptoCardComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([CryptoEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
    })
  ],
  providers: [CryptoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
