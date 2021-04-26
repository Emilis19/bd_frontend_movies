import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMovieDetailsComponent } from './user-movie-details.component';

describe('UserMovieDetailsComponent', () => {
  let component: UserMovieDetailsComponent;
  let fixture: ComponentFixture<UserMovieDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMovieDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMovieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
