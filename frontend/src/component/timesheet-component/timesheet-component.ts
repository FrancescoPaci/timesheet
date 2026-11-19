import {Component, computed} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {Project} from '../../service/project-service';
import {TimesheetGridComponent} from '../timesheet-grid-component/timesheet-grid-component';

@Component({
  imports: [TimesheetGridComponent],
  selector: 'app-timesheet-component',
  styleUrl: './timesheet-component.css',
  templateUrl: './timesheet-component.html',
})
export class TimesheetComponent {
  readonly projectsResource = httpResource<Project[]>(() => ({
    url: '/api/projects/getProjects',
    method: 'POST',
    body: {},
  }));

  // Espone sempre un array (mai undefined) per template e [projects]="projects()"
  readonly projects = computed(() => this.projectsResource.value() ?? []);

  readonly errorMessage = computed(() =>
    this.projectsResource.error()
      ? 'Impossibile caricare le commesse.'
      : null
  );
}
