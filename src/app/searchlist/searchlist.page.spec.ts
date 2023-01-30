import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchlistPage } from './searchlist.page';

describe('SearchlistPage', () => {
  let component: SearchlistPage;
  let fixture: ComponentFixture<SearchlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
