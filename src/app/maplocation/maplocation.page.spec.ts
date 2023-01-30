import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaplocationPage } from './maplocation.page';

describe('MaplocationPage', () => {
  let component: MaplocationPage;
  let fixture: ComponentFixture<MaplocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaplocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaplocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
