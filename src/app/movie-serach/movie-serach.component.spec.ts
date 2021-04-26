import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSerachComponent } from './movie-serach.component';

describe('MovieSerachComponent', () => {
  let component: MovieSerachComponent;
  let fixture: ComponentFixture<MovieSerachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieSerachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieSerachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
