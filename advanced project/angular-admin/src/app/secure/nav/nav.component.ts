import { Component, OnInit } from '@angular/core';
import { Emitters } from '../../../app/emitters/emitters';
import { User } from '../../../app/interfaces/user';
import { AuthService } from '../../../app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user!: User | null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((user) => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe((res) => {
      console.log(res);
    });
  }
}
