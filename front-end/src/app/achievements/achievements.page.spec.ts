import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AchievementsPage } from './achievements.page';

describe('AchievementsPage', () => {
  let component: AchievementsPage;
  let fixture: ComponentFixture<AchievementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AchievementsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
