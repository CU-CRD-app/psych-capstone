import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WhosNewComponent } from './whos-new.component';

describe('WhosNewComponent', () => {
  let component: WhosNewComponent;
  let fixture: ComponentFixture<WhosNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhosNewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WhosNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
