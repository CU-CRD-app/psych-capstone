import { TestBed } from '@angular/core/testing';

import { GetProgressService } from './get-progress.service';

describe('GetProgressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetProgressService = TestBed.get(GetProgressService);
    expect(service).toBeTruthy();
  });
});