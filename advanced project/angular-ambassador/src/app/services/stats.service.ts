import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private http: HttpClient) {}

  stats(): Observable<any> {
    return this.http.get(`${environment.api}/stats`);
  }

  rankings(): Observable<any> {
    return this.http.get(`${environment.api}/rankings`);
  }
}
