import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { Room } from 'src/app/model/Room';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {

  @Input()
  room: Room;

  @Output()
  dataChangedEvent = new EventEmitter();

  rooms: Array<Room>;

  message = '';

  isAdminUser = false;
  selectedRoom = null;
  roomId = null;
  
  action = '';


  constructor(private router: Router, private route : ActivatedRoute,private dataService: DataService, private authService: AuthService) { }

  ngOnInit() {

    this.roomId = this.route.snapshot.queryParamMap.get("id");
    this.action = this.route.snapshot.queryParamMap.get("action");

    this.dataService.getRooms().subscribe(next => {
      
      this.rooms = next;
      console.log("ROOMs", this.rooms)
      this.selectedRoom = this.rooms.find(room => room.id === +this.roomId);
      console.log('selected room',this.selectedRoom);
      console.log('selectedRoomID',this.selectedRoom.id);
    }, error => {
      console.log(error);
    })

    
    console.log('selected room',this.selectedRoom);
    console.log("======");
    console.log(this.roomId);
    console.log(this.action);

    // this.dataService.get

    if(this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }

    /**
     * // first way
    this.userType = this.route.snapshot.queryParamMap.get("userType");
    this.list = this.route.snapshot.queryParamMap.get("list");
    // second way
    this.route.queryParamMap.subscribe(queryParams => {
       this.userType = queryParams.get("userType");
       this.list = queryParams.get("list");
     */

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

  editRoom() {
    this.router.navigate(['admin', 'rooms'], {queryParams : {action: 'edit', id: this.room.id}});
  }

  deleteRoom() {
    const result = confirm('Are you sure you wish to delete this room?');

    if(result){

      this.message = 'deleting...';
      console.log(this.selectedRoom.id);
      this.dataService.deleteRoom(this.selectedRoom.id).subscribe(next => {
        this.dataChangedEvent.emit();
        this.router.navigate(['admin', 'rooms']);
      }, error => {
        this.message = 'Sorry - this room cannot be deleted at this time';
      })
    }

  }

}
