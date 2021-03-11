import { TestBed } from '@angular/core/testing';

import { AuthRouteGardService } from './auth-route-gard.service';

describe('AuthRouteGardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthRouteGardService = TestBed.get(AuthRouteGardService);
    expect(service).toBeTruthy();
  });
});
