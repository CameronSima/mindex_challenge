import { Component, OnInit } from "@angular/core";
import { catchError, map, reduce, takeUntil, tap } from "rxjs/operators";

import { Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { EmployeeCrudEvent } from "../employeeCrudEvent";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../dialog/dialog.component";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  errorMessage: string;
  dialogRef: any;
  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchEmployees(): void {
    this.employees$ = this.employeeService.getAll().pipe(
      reduce((emps, e: Employee) => emps.concat(e), []),
      tap((emps) => console.log(emps)),
      catchError(this.handleError.bind(this)),
      takeUntil(this.destroy$)
    );
  }

  deleteReport(supervisor: Employee, report: Employee) {
    console.log("called");
    const newReports = supervisor.directReports.filter(
      (id) => id !== report.id
    );

    this.employeeService
      .save({
        ...supervisor,
        directReports: newReports,
      })
      .subscribe((r) => {
        console.log("r", r);
        this.fetchEmployees();
      });
    this.closeDialog();
  }

  updateReport(report: Employee, updatedReport: Partial<Employee>) {
    this.employeeService.save({ ...report, ...updatedReport }).subscribe(() => {
      this.fetchEmployees();
    });
    this.closeDialog();
  }

  handleEvent(event: EmployeeCrudEvent): void {
    console.log(event);
    this.openDialog(event);
  }

  private openDialog(event: EmployeeCrudEvent): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        event,
        updateReport: this.updateReport.bind(this),
        deleteReport: this.deleteReport.bind(this),
      },
    });
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || "Unable to retrieve employees");
  }
}
