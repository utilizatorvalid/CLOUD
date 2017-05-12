import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPlayersComponent } from './list-of-players.component';

describe('ListOfPlayersComponent', () => {
  let component: ListOfPlayersComponent;
  let fixture: ComponentFixture<ListOfPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
