import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RoomsComponent } from './admin/rooms/rooms.component';
import { UsersComponent } from './admin/users/users.component';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RoomDetailComponent } from './admin/rooms/room-detail/room-detail.component';
import { UserDetailComponent } from './admin/users/user-detail/user-detail.component';
import { UserEditComponent } from './admin/users/user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomEditComponent } from './admin/rooms/room-edit/room-edit.component';
import { EditBookingComponent } from './calendar/edit-booking/edit-booking.component';
import { PrefetchRoomsService } from './prefetch-rooms.service';
import { PrefetchUsersService } from './prefetch-users.service';
import { LoginComponent } from './login/login.component';
import { AuthRouteGardService } from './auth-route-gard.service';

const routes: Routes = [
  {path : 'admin/users', component: UsersComponent, canActivate : [AuthRouteGardService]},
  {path: 'admin/user', component: UserDetailComponent, canActivate: [AuthRouteGardService]},
  {path: 'admin/add/user', component: UserEditComponent, canActivate: [AuthRouteGardService]},//
  {path : 'admin/rooms', component: RoomsComponent, canActivate : [AuthRouteGardService]},
  {path: 'admin/room', component: RoomDetailComponent, canActivate: [AuthRouteGardService]},
  {path : '', component: CalendarComponent},
  {path: 'editBooking', component: EditBookingComponent, resolve : {rooms: PrefetchRoomsService, users: PrefetchUsersService}, canActivate : [AuthRouteGardService]},
  {path: 'addBooking', component: EditBookingComponent, resolve: {rooms: PrefetchRoomsService, users: PrefetchUsersService}, canActivate : [AuthRouteGardService]},
  {path: 'login', component: LoginComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo : '/404'}
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CalendarComponent,
    RoomsComponent,
    UsersComponent,
    PageNotFoundComponent,
    RoomDetailComponent,
    UserDetailComponent,
    UserEditComponent,
    RoomEditComponent,
    EditBookingComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
