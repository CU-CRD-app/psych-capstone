import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SameDifferentComponent } from './same-different.component';

describe('SameDifferentComponent', () => {
  let component: SameDifferentComponent;
  let fixture: ComponentFixture<SameDifferentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SameDifferentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SameDifferentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
