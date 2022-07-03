import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export abstract class RestService {
  abstract endpoint: string;

  constructor(protected http: HttpClient) {}

  all(page?: number): Observable<any[]> {
    let url = this.endpoint;

    if (page) {
      url += `?page=${page}`;
    }

    return this.http.get<any>(url);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint, data);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  update(id: number, data: any): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}`, data);
  }
}
