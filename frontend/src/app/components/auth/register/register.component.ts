import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SessionService } from 'src/app/services/auth/session.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: string;
  email: string;
  password: string;
  password2: string;
  role: string;

  promoterURL: string;
  aboutUsURL: string;
  errors: any


  constructor(private router: Router, private authService: AuthService, private sessionService: SessionService) {
    this.name = '';
    this.email = '';
    this.password = '';
    this.password2 = '';
    this.role = '';
    this.promoterURL = environment.promoterUrl;
    this.aboutUsURL = environment.aboutUs;
  }

  ngOnInit(): void {
  }

  register() {
    this.authService.register(this.name, this.email, this.password, this.password2, this.role).subscribe((user: any) => {

      if (user.errors) {
        this.errors = user.errors;
      } else {
        this.errors = undefined;
        this.router.navigate(['/login'])
      }
    })
  }

  isLoggedIn() {
    return this.sessionService.isClient();
  }

  logout() {
    this.authService.logout();
  }

}
