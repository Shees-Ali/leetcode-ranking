import { Component } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'leet-code-list';
  constructor(analytics: Analytics) {
    logEvent(analytics, 'app_open', { component: 'AppComponent' });
  }
}
