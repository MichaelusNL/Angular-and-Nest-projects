import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '../../..//app/classes/auth';
import { User } from '../../../app/interfaces/user';
import { AuthService } from '../../../app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    Auth.userEmitter.subscribe((user) => (this.user = user));
  }

  logout(): void {
    this.authService.logout().subscribe((res) => console.log('success'));
  }
}
