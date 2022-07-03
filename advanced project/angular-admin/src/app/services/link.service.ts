import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Link } from '../interfaces/link';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  constructor(private http: HttpClient) {}

  all(id: number): Observable<Link[]> {
    return this.http.get<Link[]>(`${environment.api}/users/${id}/links`);
  }
}
