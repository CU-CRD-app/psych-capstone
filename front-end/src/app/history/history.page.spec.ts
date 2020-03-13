import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { historyPage } from './history.page';

describe('historyPage', () => {
  let component: historyPage;
  let fixture: ComponentFixture<historyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [historyPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(historyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
