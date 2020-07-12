import { Component } from '@angular/core';
import { SessionService } from './core/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public session: SessionService) {
  }

}
