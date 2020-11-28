import { TestBed } from '@angular/core/testing';

import { RedditServiceService } from './reddit-service.service';

describe('RedditServiceService', () => {
  let service: RedditServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedditServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
