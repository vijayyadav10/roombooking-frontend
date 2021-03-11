import { TestBed } from '@angular/core/testing';

import { FormResetService } from './form-reset.service';

describe('FormResetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormResetService = TestBed.get(FormResetService);
    expect(service).toBeTruthy();
  });
});
