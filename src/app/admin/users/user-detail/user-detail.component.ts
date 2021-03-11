import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input()
  user: User;

  @Output()
  dataChangedEvent = new EventEmitter();

  users: Array<User>;
  selectedUser = null;

  message = '';
  isAdminUser = false;
  constructor(private dataService: DataService, private router:Router,private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    if(this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }

    this.dataService.getUsers().subscribe(next => {
      console.log('NEXT',next);
      this.users = next;
      this.route.queryParams.subscribe((params) => {
        const id = params['id'];
        console.log("ID", id)
        this.selectedUser = this.users.find(user => user.id === +id);
        console.log('this.selectedUser',this.selectedUser);
      })
    }, (error) => {
    })

    this.authService.roleSetEvent.subscribe(
      next => {
        if(next === 'ADMIN') {
          this.isAdminUser = true;
        }else {
          this.isAdminUser = false;
        }
      }
    ) 
  }

  editUser() {
    this.router.navigate(['admin','add','user'],{queryParams: {action:'edit', id: this.selectedUser.id}});
    // this.router.navigate(['admin','users'],{queryParams: {action:'edit', id: this.selectedUser.id}});
  }

  deleteUser() {
    this.message = 'deleting...'
    this.dataService.deleteUser(this.selectedUser.id).subscribe(next => {
      this.dataChangedEvent.emit();
      this.router.navigate(['admin','users']);
    }, error => {
      this.message="Sorry, this user cannot be deleted at this point of time, contact support: -vizzyadav1997@gamil.com";
    });
  }

  resetPassword() {
    this.dataService.resetUserPassword(this.user.id).subscribe(
      next => this.message = 'The password has been reset',
      error => this.message="Sorry, something went wrong, please contact support: -vizzyadav1997@gamil.com"
    );
  }

}
