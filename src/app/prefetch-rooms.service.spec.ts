import { TestBed } from '@angular/core/testing';

import { PrefetchRoomsService } from './prefetch-rooms.service';

describe('PrefetchRoomsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrefetchRoomsService = TestBed.get(PrefetchRoomsService);
    expect(service).toBeTruthy();
  });
});
