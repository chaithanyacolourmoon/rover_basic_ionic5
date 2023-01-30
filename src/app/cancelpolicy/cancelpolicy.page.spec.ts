import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancelpolicyPage } from './cancelpolicy.page';

describe('CancelpolicyPage', () => {
  let component: CancelpolicyPage;
  let fixture: ComponentFixture<CancelpolicyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelpolicyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelpolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
