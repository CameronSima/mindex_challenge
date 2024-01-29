import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

import { Employee } from "../employee";
import { Observable, Subject, concat, from, of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  reduce,
  takeUntil,
} from "rxjs/operators";
import { EmployeeService } from "../employee.service";
import { EmployeeCrudEvent } from "../employeeCrudEvent";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.css"],
})
export class EmployeeComponent {
  @Input() employee: Employee;

  @Output() emitter: EventEmitter<EmployeeCrudEvent> =
    new EventEmitter<EmployeeCrudEvent>();
  allReports$: Observable<Employee[]>;
  private destroy$ = new Subject<void>();

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.allReports$ = this.allReports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete(employee: Employee): void {
    // can only delete direct reports from an employee.
    // In order to remove a sub-report, you must first remove it from the supervisor's direct reports.
    if (this.isDirectReport(employee)) {
      this.emitter.emit({
        employee: employee,
        supervisor: this.employee,
        type: "delete",
      });
    }
  }

  onUpdate(employee: Employee): void {
    this.emitter.emit({ employee: employee, type: "update" });
  }

  allReports(): Observable<Employee[]> {
    return this.reports(this.employee.directReports);
  }

  private reports(directReports: number[]): Observable<Employee[]> {
    if (!directReports || directReports.length === 0) {
      return of([]);
    }

    return from(directReports).pipe(
      // map each report id to an observable of the employee object
      concatMap((reportId) =>
        this.employeeService.get(reportId).pipe(
          catchError((error) => {
            console.error("Failed to fetch report:", error);
            return of(null);
          })
        )
      ),
      mergeMap((report) =>
        // recursively fetch all reports for this report
        this.reports(report.directReports).pipe(
          map((subReports) => [report, ...subReports])
        )
      ),
      // reduce the array of arrays into a single array
      reduce((acc, reports) => [...acc, ...reports], []),
      takeUntil(this.destroy$)
    );
  }

  isDirectReport(report: Employee): boolean {
    return this.employee.directReports.includes(report.id);
  }
}
