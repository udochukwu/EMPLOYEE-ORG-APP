export interface IEmployee {
    id: number;
    name: string;
    supervisorId?: number;
    subordinates?: IEmployee[]
}

export interface IEmployeeOrgApp {
    ceo: IEmployee;
    employees?: IEmployee[];
}