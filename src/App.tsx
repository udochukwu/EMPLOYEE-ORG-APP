import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import EmployeeOrgApp from './services/EmployeeOrgApp';
import { ceo, employees as initialEmployees } from './database';
import { IEmployee } from './types';
function App() {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [employee, setEmployee] = useState<string | number | undefined>(
    undefined
  );
  const [supervisor, setSupervisor] = useState<string | number | undefined>(
    undefined
  );

  let nelsonTech = useMemo(() => new EmployeeOrgApp(ceo, initialEmployees), []);
  useEffect(() => {
    const employees = nelsonTech?.getEmployees();
    setEmployees(employees);
  }, [nelsonTech]);

  const renderChildren = (employee: IEmployee) => {
    return (
      <>
        <div className='parent-wrapper' key={employee.id}>
          <li>{`(${employee?.id}) ${employee?.name}`}</li>
          {employee?.subordinates && employee?.subordinates?.length > 0 && (
            <ul>{employee?.subordinates?.map((sub) => renderChildren(sub))}</ul>
          )}
        </div>
      </>
    );
  };
  console.log(employee, supervisor);
  return (
    <div className='container'>
      <div className='row my-5'>
        <div className='col-md-4'>
          <div className='mb-3'>
            <label className='form-label'>Employee </label>
            <select
              className='form-select'
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            >
              <option>Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee?.name}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Supervisor</label>
            <select
              className='form-select'
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
            >
              <option value={undefined}>Select Supervisor</option>
              {employees.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup?.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (employee && supervisor) {
                nelsonTech.move(+employee, +supervisor);
                setEmployees(nelsonTech.getEmployees());
              }
            }}
            className='btn btn-success w-100'
            disabled={
              !employee ||
              !Number.isInteger(+employee) ||
              !supervisor ||
              !Number.isInteger(+supervisor)
            }
          >
            Move
          </button>
          <div className='d-flex mt-3 '>
            <button
              className='btn btn-outline-primary me-2 btn-sm'
              onClick={() => {
                nelsonTech.undo();
                setEmployees(nelsonTech.getEmployees());
              }}
            >
              Undo
            </button>
            <button
              className='btn btn-primary btn-sm'
              onClick={() => {
                nelsonTech.redo();
                setEmployees(nelsonTech.getEmployees());
              }}
            >
              Redo
            </button>
          </div>
        </div>
        <div className='col-md-8'>
          {employees.length > 0 ? (
            <ul>{renderChildren(employees[0])}</ul>
          ) : (
            'No Employees at the moment'
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
