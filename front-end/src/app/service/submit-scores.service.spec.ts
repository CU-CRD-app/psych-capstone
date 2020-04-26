import { TestBed } from '@angular/core/testing';

import { SubmitScoresService } from './submit-scores.service';

describe('SubmitScoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubmitScoresService = TestBed.get(SubmitScoresService);
    expect(service).toBeTruthy();
  });
});
