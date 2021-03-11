import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { User } from './model/User';

@Injectable({
  providedIn: 'root'
})
export class PrefetchUsersService implements Resolve<Observable<Array<User>>>{

  constructor(private dataService : DataService) {
  }
  resolve() {
    return this.dataService.getUsers();
  }
}

/*
And the production standard way to do what we're trying to do here to pre-fetch data, is to use 
what's called a resolver. 
A resolver is an object which resolves an observable. It's another way of working with the observer 
design pattern. The resolver does the subscribing part, and then it waits for the data to become available. 
In coding terms, a resolver is a service that implements an interface called the Resolve Interface. 
*/