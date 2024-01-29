import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogComponent } from "./dialog.component";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../employeeCrudEvent";

const data: DialogData = {
  event: {
    type: "delete",
    employee: {
      id: 1,
      firstName: "first",
      lastName: "last",
      position: "jobTitle",
      compensation: 100000,
    },
    supervisor: {
      id: 2,
      firstName: "first",
      lastName: "last",
      position: "jobTitle",
      compensation: 100000,
    },
  },
  deleteReport: () => {},
  updateReport: () => {},
};

describe("DialogComponent", () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call deleteReport when delete is clicked", () => {
    // Arrange
    const fixture = TestBed.createComponent(DialogComponent);
    const component = fixture.debugElement.componentInstance;
    component.data = data;
    component.data.event.type = "delete";
    component.data.deleteReport = () => {};
    spyOn(component.data, "deleteReport");

    // Act
    component.onDelete();

    // Assert
    expect(component.data.deleteReport).toHaveBeenCalled();
  });
});
