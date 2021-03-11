import { EventEmitter, Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticate = false;
  authenticationResultEvent = new EventEmitter<boolean>();
  // jwtToken : string;
  role: string;
  roleSetEvent = new EventEmitter<string>();

  constructor(private dataService: DataService) { }

  authenticate(name: String, password: String) {
  this.dataService.validateUser(name, password).subscribe(
      next => {
        this.setupRole();
        this.isAuthenticate = true; 
        this.authenticationResultEvent.emit(true);
      } ,
      error => {
        this.isAuthenticate = false
        this.authenticationResultEvent.emit(false);
      }
    )
  }

  setupRole() {
    this.dataService.getRole().subscribe(
      next =>{
       console.log(next); 
      this.role = next.role;
        this.roleSetEvent.emit(next.role);
    })
  }
 
  checkIfAlreadyAuthenticated() {
    this.dataService.getRole().subscribe(
      next => {
        if(next.role !== ''){
          this.role = next.role;
          this.roleSetEvent.emit(next.role);
          this.isAuthenticate = true;
          this.authenticationResultEvent.emit(true);
        }
      }
    )
  }

  logout() {
    this.dataService.logout().subscribe();
    this.roleSetEvent.emit('null');
    this.role = 'null';
    this.isAuthenticate = false;
    this.authenticationResultEvent.emit(false);
  }

  // getRole(): string {
  //   // if(this.jwtToken == null) return null;
  //   // const encodedPayload = this.jwtToken.split(".")[1];
  //   // const payload = atob(encodedPayload);
  //   // return JSON.parse(payload).role;
  //   return 'ADMIN';
  // }
}
