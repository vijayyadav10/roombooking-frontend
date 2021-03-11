import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
 
  constructor(private router: Router, private authService: AuthService) { }

   userIsLoggedIn = false;

  ngOnInit() {
    if(this.authService.isAuthenticate){
      this.userIsLoggedIn = true;
    }
    this.authService.authenticationResultEvent.subscribe(next => {
      if(next){
        this.userIsLoggedIn = true
      }else {
        this.userIsLoggedIn = false
      }
    })
  }

  navigateToRoomsAdmin() {
    this.router.navigate(['admin','rooms']);
  }

  navigateToRoomsUser() {
    this.router.navigate(['admin','users']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.navigateToHome();
  }

}
