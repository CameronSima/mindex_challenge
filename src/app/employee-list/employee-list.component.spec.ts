import { async, TestBed } from "@angular/core/testing";
import { Component, Input } from "@angular/core";

import { EmployeeListComponent } from "./employee-list.component";
import { EmployeeService } from "../employee.service";
import { of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

@Component({ selector: "app-employee", template: "" })
class EmployeeComponent {
  @Input("employee") employee: any;
}

@Component({ selector: "app-mat-grid-list", template: "" })
class GridListComponent {}

@Component({ selector: "app-mat-grid-tile", template: "" })
class GridTileComponent {}

const employeeServiceSpy = jasmine.createSpyObj("EmployeeService", [
  "getAll",
  "get",
  "save",
  "remove",
]);

const dialogSpy = jasmine.createSpyObj("MatDialog", ["open", "close"]);

describe("EmployeeListComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeListComponent,
        EmployeeComponent,
        GridListComponent,
        GridTileComponent,
      ],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();
  }));

  it("should create the component", async(() => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));

  it("should delete a report from a supervisor", () => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const component = fixture.debugElement.componentInstance;
    component.dialogRef = { close: () => {} };
    // Arrange
    const supervisor = { id: 1, directReports: [2, 3] };
    const report = { id: 2 };
    const expectedSupervisor = { id: 1, directReports: [3] };

    // Mock the save method to return an observable
    employeeServiceSpy.save.and.returnValue(of(null));

    // Spy on fetchEmployees to check if it gets called
    spyOn(component, "fetchEmployees");

    // Act
    component.deleteReport(supervisor, report);

    // Assert
    expect(employeeServiceSpy.save).toHaveBeenCalledWith(expectedSupervisor);
    expect(component.fetchEmployees).toHaveBeenCalled();
  });

  it("should update a report", () => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const component = fixture.debugElement.componentInstance;
    component.dialogRef = { close: () => {} };
    // Arrange
    const report = { id: 2 };
    const expectedReport = { id: 2, firstName: "first" };

    // Mock the save method to return an observable
    employeeServiceSpy.save.and.returnValue(of(null));

    // Spy on fetchEmployees to check if it gets called
    spyOn(component, "fetchEmployees");

    // Act
    component.updateReport(report, { firstName: "first" });

    // Assert
    expect(employeeServiceSpy.save).toHaveBeenCalledWith(expectedReport);
    expect(component.fetchEmployees).toHaveBeenCalled();
  });

  it("should open a dialog", () => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const component = fixture.debugElement.componentInstance;
    component.dialogRef = { close: () => {} };
    // Arrange
    const event = { type: "delete" };

    // Act
    component.openDialog(event);

    // Assert
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it("should close a dialog", () => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const component = fixture.debugElement.componentInstance;
    component.dialogRef = dialogSpy;
    // Arrange

    // Act
    component.closeDialog();

    // Assert
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
