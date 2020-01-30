import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NameFaceComponent } from './name-face.component';

describe('NameFaceComponent', () => {
  let component: NameFaceComponent;
  let fixture: ComponentFixture<NameFaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameFaceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NameFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
