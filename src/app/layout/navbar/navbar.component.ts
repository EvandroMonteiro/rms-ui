import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  name: string;
  surname: string;
  initial: string;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAccessTokenInvalid()) {
      this.name = this.authService.jwtPayload.user.person.name;
      this.surname = this.authService.jwtPayload.user.person.surname;
      this.initial = (`${this.name.charAt(0)}${this.surname.charAt(0)}`).toUpperCase();
    }
  }
}
