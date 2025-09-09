import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Crypto Tracker';
  currentTab: 'home' | 'favorites' = 'home';

  switchTab(tab: 'home' | 'favorites'): void {
    this.currentTab = tab;
  }
}
