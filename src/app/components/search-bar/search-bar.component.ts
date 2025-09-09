import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnDestroy {
  @Input() placeholder: string = 'Search cryptocurrencies...';
  @Input() loading: boolean = false;
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  searchQuery: string = '';

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => this.search.emit(query));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  onClear(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.clear.emit();
  }
}
