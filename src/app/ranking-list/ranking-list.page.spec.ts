import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingListComponent } from './ranking-list.component';

describe('RankingListComponent', () => {
  let component: RankingListComponent;
  let fixture: ComponentFixture<RankingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingListComponent]
    });
    fixture = TestBed.createComponent(RankingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
