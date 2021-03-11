import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { FormResetService } from 'src/app/form-reset.service';
import { Room } from 'src/app/model/Room';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Array<Room>;
  selectedRoom: Room;
  action: string;
  loadingData = true;
  message = "Loading...";
  reloadAttempts = 0;
  isAdminUser = false;

  constructor(
    private dataService: DataService, 
    private route: ActivatedRoute, 
    private router: Router,
    private formResetService: FormResetService,
    private authService: AuthService) { }

  
  ngOnInit() {
    this.loadData();

    if(this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
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

  loadData(){
    console.log("inloadData");
    this.dataService.getRooms().subscribe(
      (next) => {

        // if(this.authService.role === 'ADMIN') {
          console.log("just in");
        //   this.isAdminUser = true;
        // }
        
        this.rooms = next;
        console.log("inloadData next");
        this.loadingData = false;
        this.processUrlParams();
      },
      (error) => {
        if(error.status === 402){
          this.message = "Sorry, you need to pay.";
        } else {
          this.reloadAttempts++;
          if(this.reloadAttempts <= 10){
            this.message = "Sorry, something went wrong, trying again... please wait ";
            this.loadData();
          }else {
            this.message = "Sorry, something went wrong, please contact support ";
          }
        } 
      }
    );
  }  

  processUrlParams() {
    
    this.route.queryParams.subscribe(
      (params) => {
        this.action=null;
        const id = params['id'];
        if(id) {
          this.selectedRoom = this.rooms.find(room => room.id === +id);
          console.log('this.selectedRoom',this.selectedRoom)
          this.action = params['action'];
        }
        if(params['action'] === 'add') {
          this.selectedRoom = new Room();
          this.action = 'edit';
          this.formResetService.resetRoomFormEvent.emit(this.selectedRoom);
        }
      }
    )
  }


  setRoom(id: number) {
    this.router.navigate(['admin','room'], {queryParams: {id, action: 'view'} });
    // this.router.navigate(['admin','rooms'], {queryParams: {id, action: 'view'} });
  }

  addRoom() {
    this.router.navigate(['admin','rooms'], {queryParams: {action: 'add'} });
  }

}
