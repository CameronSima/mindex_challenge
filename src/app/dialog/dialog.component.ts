import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData, EmployeeCrudEvent } from "../employeeCrudEvent";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
})
export class DialogComponent implements OnInit {
  employeeForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    const { event } = this.data;
    console.log(event);
    this.employeeForm = new FormGroup({
      firstName: new FormControl({
        value: event.employee.firstName,
        disabled: true,
      }),
      lastName: new FormControl({
        value: event.employee.lastName,
        disabled: true,
      }),
      compensation: new FormControl(event.employee.compensation),
    });
  }

  onDelete(): void {
    this.data.deleteReport(
      this.data.event.supervisor,
      this.data.event.employee
    );
  }
  onUpdate(): void {
    this.data.updateReport(this.data.event.employee, {
      compensation: this.employeeForm.value.compensation,
    });
  }
}
