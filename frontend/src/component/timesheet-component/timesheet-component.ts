import {Component, inject, signal} from '@angular/core';
import {Project, ProjectService} from '../../service/project-service';

@Component({
  imports: [],
  selector: 'app-timesheet-component',
  styleUrl: './timesheet-component.css',
  templateUrl: './timesheet-component.html',
})
export class TimesheetComponent {
  private projectService = inject(ProjectService);

  projects = signal<Project[]>([]);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => {
        console.error('Errore caricamento progetti:', err);
        this.errorMessage.set('Impossibile caricare le commesse.');
      }
    });
  }
}
