import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { Booking } from '../model/Booking';
import { User } from '../model/User';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  bookings: Array<Booking>;
  selectedDate: string;
  dataLoaded = false;
  message = '';
  isAdminUser = false;
  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute,private authService: AuthService) { }

  ngOnInit() {

    this.loadData();
    console.log("1",this.isAdminUser)
    if(this.authService.role === 'ADMIN') {
      console.log("1.5",this.isAdminUser)
      this.isAdminUser = true;
      console.log("1.8",this.isAdminUser)
    }
    console.log("2",this.isAdminUser)
    this.authService.roleSetEvent.subscribe(
      next => {
        console.log("3",this.isAdminUser)
        if(next === 'ADMIN') {
          this.isAdminUser = true;
        }else {
          this.isAdminUser = false;
        }
        console.log("4",this.isAdminUser)
      }
    ) 
    console.log("5",this.isAdminUser)
  }

  loadData() {
    this.message = 'Loading data ...';

    this.dataService.getUser(13).subscribe(
      (next: User) => {
        console.log(next.name);
        console.log(typeof next);
      }
    )

    this.route.queryParams.subscribe(
      params => {
        this.selectedDate = params['date'];
        if(!this.selectedDate){
          this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        }
        this.dataService.getBookings(this.selectedDate).subscribe(
          next => {
          this.bookings = next;
          this.dataLoaded = true;
          this.message = '';
        }, error => {
          this.message = 'Sorry - the data could not be loaded contact support vizzyadav1997@gmail.com';
        })
      } 
    )
  }

  editBooking(id: number){
    this.router.navigate(['editBooking'], {queryParams: {id}});
  }

  addBooking() {
    this.router.navigate(['addBooking']);
  }

  deleteBooking(id: number) {
    this.message = 'deleting please wait...';
    this.dataService.deleteBooking(id).subscribe(
      next => {this.message = ''; this.loadData();},
      error => { this.message = 'Sorry there was a problem deleting the item'; }
    );
  }

  dateChange() {
    this.router.navigate([''], {queryParams: {date: this.selectedDate}});
  }
}
