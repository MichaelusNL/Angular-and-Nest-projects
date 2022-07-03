import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends RestService {
  endpoint: string = `${environment.api}/orders`;

  export(): Observable<any> {
    return this.http.post(
      `${this.endpoint}/export`,
      {},
      { responseType: 'blob' }
    );
  }

  chart(): Observable<any> {
    return this.http.get(`${this.endpoint}/chart`);
  }
}
