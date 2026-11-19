import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Project} from '../../service/project-service';

export interface ProjectOption {
  id: number;
  code: string;
  description: string;
}

export interface DayColumn {
  day: number;
  label: string;
  isWeekend: boolean;
}

export interface DayEntry {
  hours: number | null;
  projectId: number | null;
}

export interface TimesheetRow {
  id: string;
  entries: Record<number, DayEntry>;
}

@Component({
  selector: 'app-timesheet-grid-component',
  imports: [FormsModule],
  templateUrl: './timesheet-grid-component.html',
  styleUrl: './timesheet-grid-component.css',
})
export class TimesheetGridComponent {
  // Lista progetti passata dal componente padre (es. caricata da ProjectService)
  projects = input<Project[]>([]);

  private readonly now = new Date();
  readonly year = this.now.getFullYear();
  readonly month = this.now.getMonth(); // 0-based

  readonly monthTitle = new Intl.DateTimeFormat('it-IT', {
    month: 'long',
    year: 'numeric',
  }).format(this.now);

  // Giorni del mese corrente con flag sabato/domenica
  readonly days = computed<DayColumn[]>(() => {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const weekdayFormatter = new Intl.DateTimeFormat('it-IT', { weekday: 'short' });

    return Array.from({ length: daysInMonth }, (_, idx) => {
      const day = idx + 1;
      const date = new Date(this.year, this.month, day);
      const dayOfWeek = date.getDay(); // 0 = Domenica, 6 = Sabato
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekdayShort = weekdayFormatter.format(date).replace('.', '');

      return {
        day,
        label: `${day} ${weekdayShort}`,
        isWeekend,
      };
    });
  });

  // Righe del timesheet (iniziamo con 1 riga)
  readonly rows = signal<TimesheetRow[]>([this.createEmptyRow()]);

  // Totale ore del mese (esempio utile)
  readonly totalHours = computed(() => {
    let sum = 0;
    for (const row of this.rows()) {
      for (const entry of Object.values(row.entries)) {
        if (typeof entry.hours === 'number' && !Number.isNaN(entry.hours)) {
          sum += entry.hours;
        }
      }
    }
    return sum;
  });

  private createEmptyRow(): TimesheetRow {
    const entries: Record<number, DayEntry> = {};
    for (const d of this.days()) {
      entries[d.day] = { hours: null, projectId: null };
    }
    return {
      id: crypto.randomUUID(),
      entries,
    };
  }

  addRow(): void {
    this.rows.update((current) => [...current, this.createEmptyRow()]);
  }

  removeRow(rowId: string): void {
    this.rows.update((current) =>
      current.length > 1 ? current.filter((r) => r.id !== rowId) : current
    );
  }

  updateHours(rowId: string, day: number, rawValue: string): void {
    const parsed = rawValue === '' ? null : Number(rawValue);
    const hours = parsed !== null && Number.isNaN(parsed) ? null : parsed;

    this.rows.update((current) =>
      current.map((row) => {
        if (row.id !== rowId) return row;
        const prev = row.entries[day] ?? { hours: null, projectId: null };
        return {
          ...row,
          entries: {
            ...row.entries,
            [day]: { ...prev, hours },
          },
        };
      })
    );
  }

  updateProject(rowId: string, day: number, rawProjectId: string): void {
    const projectId = rawProjectId === '' ? null : Number(rawProjectId);

    this.rows.update((current) =>
      current.map((row) => {
        if (row.id !== rowId) return row;
        const prev = row.entries[day] ?? { hours: null, projectId: null };
        return {
          ...row,
          entries: {
            ...row.entries,
            [day]: { ...prev, projectId },
          },
        };
      })
    );
  }

  saveTimesheet(): void {
    // Qui puoi trasformare `this.rows()` nel payload DTO da inviare al backend Spring Boot
    console.log('Dati timesheet pronti:', this.rows());
  }
}
