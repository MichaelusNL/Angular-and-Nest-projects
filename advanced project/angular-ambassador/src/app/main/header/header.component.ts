import { Emitters } from 'src/app/emitters/emitters';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../app/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  title = '';
  description = '';
  user: User | null = null;

  constructor() {}

  ngOnInit(): void {
    this.user = Emitters.user;

    this.title = this.user ? `$ ${this.user.revenue}` : `Welcome`;
    this.description = this.user
      ? `You have earned this far`
      : `Share links to earn money`;

    console.log(this.user);
  }
}
