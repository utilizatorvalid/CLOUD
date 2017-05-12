import { TestBed, inject } from '@angular/core/testing';

import { ListOfPlayersService } from './list-of-players.service';

describe('ListOfPlayersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListOfPlayersService]
    });
  });

  it('should ...', inject([ListOfPlayersService], (service: ListOfPlayersService) => {
    expect(service).toBeTruthy();
  }));
});
