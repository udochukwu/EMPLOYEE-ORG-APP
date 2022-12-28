import { IEmployee, IEmployeeOrgApp } from '../types';
import Executor from './Executor';
export default class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: IEmployee;
  employees: IEmployee[];
  executor: Executor;

  constructor(ceo: IEmployee, employees: IEmployee[]) {
    this.ceo = ceo;
    this.employees = employees;
    this.executor = new Executor();
  }

  getDirectSubordinates(employeeId: number): IEmployee[] {
    const subordinates =
      this.employees.filter((e) => e.supervisorId === employeeId) || [];
    return (
      subordinates.map((sub) => ({
        ...sub,
        subordinates: this.getDirectSubordinates(sub?.id),
      })) || []
    );
  }
  getEmployees(): IEmployee[] {
    return this.employees.map((employee) => {
      return {
        ...employee,
        subordinates: this.getDirectSubordinates(employee.id),
      };
    });
  }
  move(employeeId: number, supervisorId: number): void {
    //find employees current position in database
    const employeeIndex = this.employees.findIndex(
      (employee) => employee.id === employeeId
    );

    //get employee's current supervisor
    const oldSupervisor = this.employees[employeeIndex].supervisorId;
    if (oldSupervisor === supervisorId) return;

    //get employess old subordinates and store there Id's in an array
    const employeesSubordinates = this.employees
      .filter((e) => e.supervisorId === employeeId)
      ?.map((e) => e.id);

    this.executor.execute(
      () => {
        //loop through all employee subordinates and change there supervisor to employees old supervisor
        for (let i = 0; i < employeesSubordinates.length; i++) {
          const subordinateIndex = this.employees.findIndex(
            (e) => e.id === employeesSubordinates[i]
          );
          this.employees[subordinateIndex].supervisorId = oldSupervisor;
        }
        this.employees[employeeIndex].supervisorId = supervisorId;
      },
        () => {
          //This second function is for the undo functionality
        //loop through all subordinates and change back there supervisor to the current employee
        for (let i = 0; i < employeesSubordinates.length; i++) {
          const subordinateIndex = this.employees.findIndex(
            (e) => e.id === employeesSubordinates[i]
          );
          this.employees[subordinateIndex].supervisorId = employeeId;
          this.employees[employeeIndex].supervisorId = oldSupervisor;
        }
      }
    );
  }

  undo() {
    this.executor.undo();
  }

  redo() {
    this.executor.redo();
  }
}
