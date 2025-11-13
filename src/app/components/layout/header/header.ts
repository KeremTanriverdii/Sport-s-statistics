import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faBell, faMagnifyingGlass, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth';
import { CommonModule, NgClass, TitleCasePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounce, debounceTime, distinctUntilChanged, forkJoin, map, of, switchMap, timer } from 'rxjs';
import { SearchService } from '../../../services/search';
@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink, NgClass, ReactiveFormsModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  // Icons with fontawesome
  magnifyingGlass = faMagnifyingGlass
  bell = faBell
  logOutSvg = faRightFromBracket
  // Auth
  authService = inject(AuthService)
  // Dropdown open close
  isDropdownOpen: boolean = false;
  private elementRef = inject(ElementRef)
  // Search Input Section
  searchControl = new FormControl('');
  results = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  notFound = signal<boolean>(false);
  // Search Service
  private searchService = inject(SearchService)


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inside = this.elementRef.nativeElement.contains(event.target);

    if (!inside && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }



  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
          photo: user.photoURL!
        });
      } else {
        this.authService.currentUserSig.set(null)
      }
      console.log(this.authService.currentUserSig())
    })

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query?.trim()) {
          this.results.set([]);
          this.notFound.set(false);
          return of([]);
        }

        this.isLoading.set(true);
        this.notFound.set(false);

        const sports: string[] = ['basketball', 'football'];
        type SportType = 'basketball' | 'football';

        const requests = sports.map(sport =>
          this.searchService.search(sport as SportType, 'teams', query).pipe(
            map((res: any) => {
              console.log(`${sport} teams response:`, res); // DEBUG LOG
              return {
                data: res.response || [],
                sport,
                type: 'teams'
              };
            }),
            switchMap(result => result.data.length
              ? of(result)
              : this.searchService.search(sport as SportType, 'players', query).pipe(
                map((res: any) => {
                  console.log(`${sport} players response:`, res); // DEBUG LOG
                  return { data: res.response || [], sport, type: 'players' };
                })
              )
            ),
            switchMap(result => result.data.length
              ? of(result)
              : this.searchService.search(sport as SportType, 'leagues', query).pipe(
                map((res: any) => {
                  console.log(`${sport} leagues response:`, res); // DEBUG LOG
                  return { data: res.response || [], sport, type: 'leagues' };
                })
              )
            ),
            map(result => {
              const mappedData = result.data.map((item: any) => ({
                ...item,
                _uniqueId: `${result.sport}-${result.type}-${item.id || Math.random()}`,
                _sport: result.sport,
                _type: result.type
              }));
              console.log('Mapped data:', mappedData); // DEBUG LOG
              return mappedData;
            }),
            catchError(() => of([]))
          )
        );

        return forkJoin(requests);
      })
    ).subscribe(resultsArray => {
      this.isLoading.set(false);
      console.log('Results array:', resultsArray); // DEBUG LOG

      const combinedResults = resultsArray.flat();
      console.log('Combined results:', combinedResults); // DEBUG LOG

      if (combinedResults.length) {
        this.results.set(combinedResults);
        this.notFound.set(false);
      } else {
        this.results.set([]);
        this.notFound.set(true);
      }
    });
  }
}
