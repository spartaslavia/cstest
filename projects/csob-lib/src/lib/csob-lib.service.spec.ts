import { TestBed } from '@angular/core/testing';

import { CsobLibService } from './csob-lib.service';

describe('CsobLibService', () => {
  let service: CsobLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsobLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
