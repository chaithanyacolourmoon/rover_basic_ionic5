import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NointernetpageComponent } from './nointernetpage.component';

describe('NointernetpageComponent', () => {
  let component: NointernetpageComponent;
  let fixture: ComponentFixture<NointernetpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NointernetpageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NointernetpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
