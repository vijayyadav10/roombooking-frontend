import { TestBed } from '@angular/core/testing';

import { PrefetchUsersService } from './prefetch-users.service';

describe('PrefetchUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrefetchUsersService = TestBed.get(PrefetchUsersService);
    expect(service).toBeTruthy();
  });
});
