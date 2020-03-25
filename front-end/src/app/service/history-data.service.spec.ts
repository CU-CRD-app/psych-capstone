import { TestBed } from '@angular/core/testing';

import { HistoryDataService } from './history-data.service';

describe('HistoryDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryDataService = TestBed.get(HistoryDataService);
    expect(service).toBeTruthy();
  });
});
