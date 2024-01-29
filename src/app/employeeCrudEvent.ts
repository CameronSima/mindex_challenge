import { Employee } from "./employee";

export interface EmployeeCrudEvent {
  employee: Employee;
  supervisor?: Employee;
  type: "delete" | "update";
}

export interface DialogData {
  event: EmployeeCrudEvent;
  updateReport: (report: Employee, updatedReport: Partial<Employee>) => void;
  deleteReport: (supervisor: Employee, report: Employee) => void;
}
