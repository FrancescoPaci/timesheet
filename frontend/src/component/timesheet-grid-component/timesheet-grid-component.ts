import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../service/project-service';

export interface MonthOption {
  value: number; // 0-based (0 = Gennaio .. 11 = Dicembre)
  label: string;
}

export interface DayColumn {
  day: number;
  label: string;
  isWeekend: boolean;
}

export interface TimesheetRow {
  id: string;
  projectId: number | null;
  hoursByDay: Record<number, number | null>;
}

@Component({
  selector: 'app-timesheet-grid-component',
  imports: [FormsModule],
  templateUrl: './timesheet-grid-component.html',
  styleUrl: './timesheet-grid-component.css',
})
export class TimesheetGridComponent {
  // Lista progetti passata dal componente padre
  projects = input<Project[]>([]);

  private readonly now = new Date();
  readonly year = this.now.getFullYear();

  // Mese selezionato (0-based, inizializzato al mese corrente)
  readonly selectedMonth = signal<number>(this.now.getMonth());

  // Opzioni per il menu a tendina dei mesi dell'anno corrente
  readonly months: MonthOption[] = Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date(this.year, monthIndex, 1);
    const label = new Intl.DateTimeFormat('it-IT', { month: 'long' }).format(date);
    return {
      value: monthIndex,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  });

  readonly monthTitle = computed(() => {
    const date = new Date(this.year, this.selectedMonth(), 1);
    return new Intl.DateTimeFormat('it-IT', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  });

  // Giorni del mese selezionato con flag sabato/domenica
  readonly days = computed<DayColumn[]>(() => {
    const currentYear = this.year;
    const currentMonth = this.selectedMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weekdayFormatter = new Intl.DateTimeFormat('it-IT', { weekday: 'short' });

    return Array.from({ length: daysInMonth }, (_, idx) => {
      const day = idx + 1;
      const date = new Date(currentYear, currentMonth, day);
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

  // Totale ore del mese selezionato
  readonly totalHours = computed(() => {
    const validDays = new Set(this.days().map((d) => d.day));
    let sum = 0;

    for (const row of this.rows()) {
      for (const [dayKey, hours] of Object.entries(row.hoursByDay)) {
        if (validDays.has(Number(dayKey)) && typeof hours === 'number' && !Number.isNaN(hours)) {
          sum += hours;
        }
      }
    }
    return sum;
  });

  private createEmptyRow(projectId: number | null = null): TimesheetRow {
    const hoursByDay: Record<number, number | null> = {};
    for (const d of this.days()) {
      hoursByDay[d.day] = null;
    }
    return {
      id: crypto.randomUUID(),
      projectId,
      hoursByDay,
    };
  }

  onMonthChange(rawMonth: string): void {
    const monthValue = Number(rawMonth);
    if (Number.isNaN(monthValue) || monthValue < 0 || monthValue > 11) {
      return;
    }

    this.selectedMonth.set(monthValue);

    // Ricostruisce le righe mantenendo i progetti già scelti, ma allineando i giorni al nuovo mese
    const newDays = this.days();
    this.rows.update((currentRows) =>
      currentRows.map((row) => {
        const nextHoursByDay: Record<number, number | null> = {};
        for (const d of newDays) {
          nextHoursByDay[d.day] = row.hoursByDay[d.day] ?? null;
        }
        return {
          ...row,
          hoursByDay: nextHoursByDay,
        };
      })
    );
  }

  addRow(): void {
    this.rows.update((current) => [...current, this.createEmptyRow()]);
  }

  removeRow(rowId: string): void {
    this.rows.update((current) =>
      current.length > 1 ? current.filter((r) => r.id !== rowId) : current
    );
  }

  updateRowProject(rowId: string, rawProjectId: string): void {
    const projectId = rawProjectId === '' ? null : Number(rawProjectId);

    this.rows.update((current) =>
      current.map((row) => (row.id === rowId ? { ...row, projectId } : row))
    );
  }

  updateHours(rowId: string, day: number, rawValue: string): void {
    const parsed = rawValue === '' ? null : Number(rawValue);
    const hours = parsed !== null && Number.isNaN(parsed) ? null : parsed;

    this.rows.update((current) =>
      current.map((row) => {
        if (row.id !== rowId) return row;
        return {
          ...row,
          hoursByDay: {
            ...row.hoursByDay,
            [day]: hours,
          },
        };
      })
    );
  }

  saveTimesheet(): void {
    const payload = {
      year: this.year,
      month: this.selectedMonth() + 1, // 1-12 se preferisci inviare mese umano al backend
      rows: this.rows(),
    };
    console.log('Dati timesheet pronti:', payload);
  }
}
