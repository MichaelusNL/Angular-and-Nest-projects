import { EventEmitter } from '@angular/core';
import { User } from '../interfaces/user';

export class Emitters {
  static _user: User | null = null;
  static authEmitter = new EventEmitter<User | null>();

  static set user(user: User | null) {
    this._user = user;
    this.authEmitter.emit(user);
  }

  static get user(): User | null {
    return this._user;
  }
}
