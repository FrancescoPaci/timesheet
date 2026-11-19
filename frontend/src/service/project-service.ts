import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  code: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = '/api/projects';

  getProjects(): Observable<Project[]> {
    return this.http.post<Project[]>(`${this.apiUrl}/getProjects`, {});
  }
}
