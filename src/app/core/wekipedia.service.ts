import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WekipediaService {

  constructor(
    private http: HttpClient
  ) {}
  wikiSearch(term: string) {
    const wikiUrl = 'https://en.wikipedia.org/w/api.php';

    const url = `${wikiUrl}?search=${term}&action=opensearch&format=json`;

    return this.http
      .jsonp(url, 'callback')
      .pipe(map(response => response[1] as string[]));
  }
}
