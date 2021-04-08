import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostModalPage } from './post-modal.page';

describe('PostModalPage', () => {
  let component: PostModalPage;
  let fixture: ComponentFixture<PostModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
