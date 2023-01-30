import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateversionPage } from './updateversion.page';

describe('UpdateversionPage', () => {
  let component: UpdateversionPage;
  let fixture: ComponentFixture<UpdateversionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateversionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateversionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
