import { Component } from '@angular/core';
import { MainFormComponent } from '../../../csob-lib/src/lib/main-form/main-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'csob-app';
}
