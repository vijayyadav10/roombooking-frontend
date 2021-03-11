import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { FormResetService } from 'src/app/form-reset.service';
import { Layout, LayoutCapacity, Room } from 'src/app/model/Room';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent implements OnInit, OnDestroy {

  @Input()
  room: Room;

  @Output()
  dataChangedEvent = new EventEmitter();

  message = '';

  layouts = Object.keys(Layout);
  layoutEnum = Layout;

  roomForm : FormGroup;
  //  = new FormGroup(
  //   {
  //     roomName : new FormControl('roomName'),
  //     location : new FormControl('location')
  //   }
  // );

  resetEventSubscription: Subscription;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private formResetService: FormResetService,
    private authService: AuthService) { }

  ngOnInit() {
    this.initializeForm();

    //***BUG FIX***
    //We want to find a way to know that we need to rerun the ngOnInit method or 
    //we have to do that triger rerunning this.initializeForm(); the eassyest option would be events.
    //so we want the child to be subscribing to an event in it's parent 
    this.resetEventSubscription = this.formResetService.resetRoomFormEvent.subscribe(
      room => {
        this.room = room;
        this.initializeForm();
      }
    )
  }

  ngOnDestroy() {
    this.resetEventSubscription.unsubscribe();
  }

  initializeForm() {
    this.roomForm = this.formBuilder.group(
      {
        roomName: [this.room.name, Validators.required],
        location: [this.room.location, [Validators.required, Validators.minLength(2)]]
      }
    );

    // this.roomForm.patchValue({
    //   roomName: this.room.name,
    //   location: this.room.location
    // });

    for(const layout of this.layouts){
      const layoutCapacity = this.room.capacities.find(lc => lc.layout === Layout[layout]);
      const initialCapacity = layoutCapacity == null ? 0 : layoutCapacity.capacity;
      this.roomForm.addControl(`layout${layout}`, this.formBuilder.control(initialCapacity));
    }
  }

  onSubmit(){
    this.message = "Saving...";
    this.room.name = this.roomForm.controls['roomName'].value;
    this.room.location = this.roomForm.value['location'];
    this.room.capacities = new Array<LayoutCapacity>();
    for(const layout of this.layouts){
      const layoutCapacity = new LayoutCapacity();
      layoutCapacity.layout = Layout[layout];
      layoutCapacity.capacity = this.roomForm.controls[`layout${layout}`].value;
      this.room.capacities.push(layoutCapacity);
    }

    if(this.room.id == null) {
      this.dataService.addRoom(this.room).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'view', id : next.id}});
        } ,
        error => {
          this.message = 'Something went wrong, you may wish to try again';
        } 
      )
    }else {
      this.dataService.updateRoom(this.room).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'view', id : next.id}});
        },
        error => {
          this.message = 'Something went wrong, you may wish to try again';
        } 
      )
    }
    //call a method in the data service to save the room.
  }

}
