import { async, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import { EmployeeComponent } from "./employee.component";
import { EmployeeService } from "../employee.service";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

@Component({ selector: "app-mat-card", template: "" })
class CardComponent {}

@Component({ selector: "app-mat-card-header", template: "" })
class CardHeaderComponent {}

@Component({ selector: "app-mat-card-title", template: "" })
class CardTitleComponent {}

@Component({ selector: "app-mat-card-subtitle", template: "" })
class CardSubtitleComponent {}

@Component({ selector: "app-mat-card-content", template: "" })
class CardContentComponent {}

const employeeServiceSpy = jasmine.createSpyObj("EmployeeService", [
  "getAll",
  "get",
  "save",
  "remove",
]);

describe("EmployeeComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardSubtitleComponent,
        CardContentComponent,
      ],
      providers: [{ provide: EmployeeService, useValue: employeeServiceSpy }],
    }).compileComponents();
  }));

  it("should create the component", async(() => {
    const fixture = TestBed.createComponent(EmployeeComponent);
    const comp = fixture.debugElement.componentInstance;
    comp.employee = {
      id: 1,
      firstName: "first",
      lastName: "last",
      position: "jobTitle",
    };

    expect(comp).toBeTruthy();
  }));

  it("should return all reports for an employee", () => {
    const fixture = TestBed.createComponent(EmployeeComponent);
    const component = fixture.debugElement.componentInstance;
    // Arrange
    const employees = [
      {
        id: 1,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [2, 3],
      },
      {
        id: 2,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [4],
      },
      {
        id: 3,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [],
      },
      {
        id: 4,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [],
      },
    ];

    component.employee = employees[0];

    const expectedReports = [employees[1], employees[2], employees[3]];

    // Mock the get method to return an observable
    employeeServiceSpy.get.and.callFake((id: number) => {
      return of(employees.find((emp) => emp.id === id));
    });

    // Act
    component.ngOnInit();
    component.allReports().subscribe((reports) => {
      console.log(reports);
      // Assert
      expect(reports.length).toEqual(expectedReports.length);
    });
  });

  it("delete button should emit an event", async(() => {
    const fixture = TestBed.createComponent(EmployeeComponent);
    const component = fixture.debugElement.componentInstance;
    const employees = [
      {
        id: 1,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [2, 3],
      },
      {
        id: 2,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [4],
      },
      {
        id: 3,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [],
      },
      {
        id: 4,
        firstName: "first",
        lastName: "last",
        position: "jobTitle",
        directReports: [],
      },
    ];
    component.employee = employees[0];
    employeeServiceSpy.get.and.callFake((id: number) => {
      return of(employees.find((emp) => emp.id === id));
    });
    spyOn(component, "isDirectReport").and.returnValue(false);
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css("#delete-4"));
    expect(deleteButton.nativeElement.disabled).toBe(true);
  }));
});
