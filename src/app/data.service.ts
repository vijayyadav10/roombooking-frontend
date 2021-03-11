import { formatDate } from '@angular/common';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Booking } from './model/Booking';
import { LayoutCapacity, Room,Layout } from './model/Room';
import { User } from './model/User';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  // getRooms() : Observable<Array<Room>>{
  //   return this.http.get<Array<Room>>(environment.restUrl + '/api/rooms')
  //     .pipe(
  //       map(data => {
  //         const rooms = new Array<Room>();
  //         for(const room of data) {
  //           rooms.push(Room.fromHttp(room));
  //         }
  //         return rooms;
  //       })
  //     );
  // }

  getRooms() : Observable<Array<Room>>{
    
    return this.http.get<Array<Room>>(environment.restUrl + '/api/rooms', {withCredentials: true})
      .pipe(
        map(data => {
          const rooms = new Array<Room>();
          for(const room of data) {
            rooms.push(Room.fromHttp(room));
          }
          return rooms;
        })
      );
  }

  getUsers() : Observable<Array<User>>{
    return this.http.get<Array<User>>(environment.restUrl + '/api/users',{withCredentials: true})
      .pipe(
        map(data => {
          const users = new Array<User>();
          for(const user of data) {
            users.push(User.fromHttp(user));
          }
          return users;
        })
      );
  }

  updateUser(user: User) :Observable<User>{
    return this.http.put<User>(environment.restUrl + '/api/users', user,{withCredentials: true});
  }

  addUser(newUser: User, password: string): Observable<User>{
    /*I don't need to start creating User with password for example as a different class. 
      Instead we can make use of Java objects. Because what we're sending in JSON, 
      if we create a Java object that's not based from a class, that when it's serialised, 
      provides the JSON in the right format, then our back end will be quite happy to accept that as a 
      back-end User object and will be able to deserialize it. */

    const fullUser = {id: newUser.id, name: newUser.name, password: password}
    return this.http.post<User>(environment.restUrl + '/api/users', fullUser,{withCredentials: true});
  }


  private getCorrectedRoom(room: Room) {
    /*
    capcities = [
      0: Object { layout: "Theater", capacity: 16 }
      1: Object { layout: "U-Shape", capacity: 0 }
      2: Object { layout: "Board Meeting", capacity: 8 }
    ]
      0: Object { layout: "THEATER", capacity: 16 }
      1: Object { layout: "USHAPE", capacity: 0 }
      2: Object { layout: "BOARD", capacity: 8 }
    ERROR: JSON parse error: Cannot deserialize value of type `com.vizz.roombooking.model.Layout` from String 
    "Theater": not one of the values accepted for Enum class: [THEATER, USHAPE, BOARD]; 
  */
    const correctedRoom = {id: room.id, name: room.name, location: room.location, capacities: []};

    for(const lc of room.capacities) {

      let correctLayout;
      for(let member in Layout){
        if(Layout[member] === lc.layout){
          correctLayout = member;
        }
      }

      const correctedLayout = {layout: correctLayout, capacity: lc.capacity}
      correctedRoom.capacities.push(correctedLayout);
    }
    return correctedRoom;
  }

  updateRoom(room:Room):Observable<Room> {
    return this.http.put<Room>(environment.restUrl + '/api/rooms', this.getCorrectedRoom(room), {withCredentials: true});
  }
  

  addRoom(newRoom:Room) {
    return this.http.post<Room>(environment.restUrl + '/api/rooms', this.getCorrectedRoom(newRoom),{withCredentials: true});
  }

  deleteRoom(id: number) : Observable<any>{
    return this.http.delete<Room>(environment.restUrl + '/api/rooms/' + id ,{withCredentials: true});
  }

  deleteUser(id: number) :Observable<any>{
    return this.http.delete(environment.restUrl + '/api/users/' + id ,{withCredentials: true});
  }

  resetUserPassword(id: number) :Observable<any>{
    return this.http.get(environment.restUrl + '/api/users/resetPassword/' + id ,{withCredentials: true});
  }

  getBookings(date: string) : Observable<Array<Booking>>{
    return this.http.get<Array<Booking>>(environment.restUrl + "/api/bookings/" + date)
      .pipe(
        map(data => {
          const bookings = new Array<Booking>();
          for(const booking of data) {
            bookings.push(Booking.fromHttp(booking));
          }
          return bookings;
        })
      );
  }

  getBooking(id: number) : Observable<Booking>{

    return this.http.get<Booking>(environment.restUrl + '/api/bookings?id=' +id ,{withCredentials: true})
      .pipe(
        map(data => Booking.fromHttp(data))
      )
  }

  private getCorrectedBooking(booking: Booking) {

    let correctLayout;
    for (let member in Layout) {
      if (Layout[member] === booking.layout) {
        correctLayout = member;
      }
    }

    if (booking.startTime.length < 8) {
      booking.startTime = booking.startTime + ':00';
    }

    if (booking.endTime.length < 8) {
      booking.endTime = booking.endTime + ':00';
    }

    const correctedBooking = {id : booking.id,  room: this.getCorrectedRoom(booking.room), user: booking.user,
      title: booking.title, date: booking.date, startTime: booking.startTime, endTime: booking.endTime,
      participants: booking.participants, layout: correctLayout};

    return correctedBooking;
  }

  saveBooking(booking: Booking) : Observable<Booking>{
    
    return this.http.put<Booking>(environment.restUrl + '/api/bookings', this.getCorrectedBooking(booking),{withCredentials: true});
  }

  addBooking(newBooking: Booking): Observable<Booking>{
    
    return this.http.post<Booking>(environment.restUrl + '/api/bookings', this.getCorrectedBooking(newBooking),{withCredentials: true});
  }

  deleteBooking(id: number) : Observable<any> {
    
    return this.http.delete(environment.restUrl + "/api/bookings/" + id,{withCredentials: true});
  }

  validateUser(name: String, password: String) : Observable<{result:string}> {
    const authData = btoa(`${name}:${password}`);
    console.log("authData===>>",authData);
    const headers = new HttpHeaders().append('Authorization', 'Basic ' + authData);

    return this.http.get<{result: string}>(environment.restUrl + '/api/basicAuth/validate', {headers: headers, withCredentials: true});

  }

  getRole(): Observable<{role: string}> {
    const headers = new HttpHeaders().append("X-Requested-With", "XMLHttpRequest");
    return this.http.get<{role: string}>(environment.restUrl + '/api/users/currentUserRole', {headers, withCredentials: true});
  }

  logout(): Observable<string> {
    return this.http.get<string>(environment.restUrl + '/api/users/logout', {withCredentials: true});
  }

  constructor(private http:HttpClient) {
  }

  getUser(id: number) :Observable<User>{
    
    return this.http.get<User>(environment.restUrl + '/api/users/' + id)
      .pipe(
        map( data => {
          return User.fromHttp(data);
        } )
      );
  }
}

//METHODS Options => The OPTIONS methods is used by 
          //client to find out what are the HTTP methods and other options supported by a web server
