import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service'
import { environment } from '../../../../environments/environment';
import { SessionService } from 'src/app/services/auth/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email: string;
  password: string;
  role: string;
  promoterURL: string;
  aboutUsURL: string;
  errors: any

  constructor(private router: Router, private authService: AuthService, private sessionService: SessionService) {
    this.email = ''
    this.password = ''
    this.role = ''
    this.promoterURL = environment.promoterUrl;
    this.aboutUsURL = environment.aboutUs;
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login(this.email, this.password, this.role).subscribe((user: any) => {
      if (user.errors) {
        this.errors = user.errors;
      } else {
        this.errors = undefined;
        if (user.role === 'CLIENT') {
          this.router.navigate(['/']);
        } else if (user.role === 'PROMOTER') {
          window.location.href = `${environment.promoterUrl}`;
        }
      }
    });
  }


  isLoggedIn() {
    return this.sessionService.isClient();
  }

  logout() {
    this.authService.logout();
  }

}
