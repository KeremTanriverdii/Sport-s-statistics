import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private headers = new HttpHeaders({
    'x-rapidapi-key': `${environment.apiSportsKey}`,
    'x-rapidapi-host': 'v3.basketball.api-sports.io'
  })
  http = inject(HttpClient)

  search(
    sports: 'basketball' | 'football',
    type: 'players' | 'teams' | 'leagues',
    query: string,
  ) {
    if (!query.trim()) return of([])

    const apiVersion = sports === 'basketball' ? 'v1' : 'v3';
    const urls = `https://${apiVersion}.${sports}.api-sports.io/${type}?search=${query}`;

    const headers = this.headers.set('x-rapidapi-host', `${apiVersion}.${sports}.api-sports.io`);

    return this.http.get(urls, { headers })
      .pipe(
        tap(res => console.log('API Response:', res)), // DEBUG LOG
        catchError(err => {
          console.error('API Error:', err); // DEBUG LOG
          return of({ response: [] });
        })
      );
  }
}