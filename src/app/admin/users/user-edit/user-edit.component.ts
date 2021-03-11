import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { FormResetService } from 'src/app/form-reset.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {

  @Input()
  user: User;

  @Output()
  dataChangeEvent = new EventEmitter();//Import EventEmitter from @angular/core NOT from events.

  formUser: User;

  message: string;

  password: string;
  password2: string;

  nameIsValid = false;
  passwordsAreValid = false;
  passwordsMatch = false;

  userResetSubscription: Subscription;

  action: string;
  userId: number;
  users: Array<User>;
  selectedUser = new User();

  constructor(
    private dataService: DataService, 
    private router: Router, 
    private formResetService: FormResetService, 
    private route: ActivatedRoute) { }

  ngOnInit() {
   
    // this.userResetSubscription = this.formResetService.resetUserFormEvent.subscribe(
    //   user => {
    //     this.user = user;
    //     this.initializeForm();
    //   }
    // )
    console.log("this.ngOnInit")
    this.action = this.route.snapshot.queryParamMap.get("action");
    console.log('this.action',this.action);
    this.initializeForm();
  }

  ngOnDestroy() {
    // this.userResetSubscription.unsubscribe();
  }

  // initializeForm() {
  //   this.userId = +this.route.snapshot.queryParamMap.get("id");

  //   this.dataService.getUsers().subscribe(next => {
  //     this.users = next;
  //     console.log('this.users===>',this.users);
  //     this.selectedUser = this.users.find(user => user.id === +this.userId);


  //     //UPDATED
  //     // this.formUser = this.selectedUser;
  //   })

    
  //   // console.log('====>',this.formUser);
  //   this.formUser = Object.assign({}, this.user);
  //   this.checkIfNameIsValid();
  //   this.checkIfPasswordsAreValid();
  // }

  initializeForm() {
    this.userId = +this.route.snapshot.queryParamMap.get("id");

    if(this.userId) {
      this.dataService.getUsers().subscribe(next => {
            this.users = next;
            console.log('this.users===>',this.users);
            this.selectedUser = this.users.find(user => user.id === +this.userId);
      
            //UPDATED
            // this.formUser = this.selectedUser;
          })
    }
      // console.log('====>',this.formUser);
    console.log('this.formUser',this.formUser)  
    console.log('this.selectedUser First',this.selectedUser)
    console.log('this.formUser First', this.formUser);
    this.formUser = Object.assign({}, this.selectedUser);
    console.log('this.selectedUser Secound',this.selectedUser)
    console.log('this.formUser Secound', this.formUser);
    this.checkIfNameIsValid();
    this.checkIfPasswordsAreValid();
  }


  onSubmit() {

    // we don't need to worry about removing the value of this.message bcoz we are navigating 
    // away from this component it will be remove out of memmory
    this.message ="saving...";
    if(this.selectedUser.id == null) {
      this.dataService.addUser(this.selectedUser, this.password).subscribe(
        (user) => {
          this.dataChangeEvent.emit();
          // this.router.navigate(['admin','users'], {queryParams: {action: 'view', id: user.id}})
          this.router.navigate(['admin','users'])
        }
      );
    }else  {
      this.dataService.updateUser(this.selectedUser).subscribe(
        (user) => {
          this.dataChangeEvent.emit();
          // this.router.navigate(['admin','users'], {queryParams: {action: 'view', id: user.id}})
          this.router.navigate(['admin','users'])
          // this.selectedUser = null;
        },
        (error) => {
          this.message = "something went wrong and the data wasn\'t saved. you may want to try again'.";
        }
      );
    }
  }

  checkIfNameIsValid() {
    if(this.selectedUser.name){
      this.nameIsValid = this.selectedUser.name.trim().length > 0;
    }else {
      this.nameIsValid = false;
    }
  }

  checkIfPasswordsAreValid() {
    console.log("===> i am in check")
    
    if(this.formUser.id !=null){
      console.log("===> 1");
      this.passwordsAreValid = true;
      this.passwordsMatch = true;
    } else {
      console.log("===> 2");
      this.passwordsMatch = this.password === this.password2;
      console.log(this.password)
      console.log(this.password2)
      console.log("===> 2",this.passwordsMatch);
      if(this.password){
        console.log("===> 3");
        this.passwordsAreValid = this.password.trim().length > 0;
      }
      else {
        console.log("===> 4");
          this.passwordsAreValid = false;
        }
    }
    console.log("===> 5");
  }
}
