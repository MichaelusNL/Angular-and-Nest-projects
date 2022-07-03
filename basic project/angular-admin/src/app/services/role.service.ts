import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends RestService {
  endpoint: string = `${environment.api}/roles`;
}
