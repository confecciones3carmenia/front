export interface User {
    _id?: string;
    name: string;
    lastname: string;
    role: string | Role;
    position: string;
}

export interface Role {
    _id?: string;
    name: string;
}

export enum TYPEUSERENUM {
    ADMIN = 'Administrador',
    OPERATOR = 'Operador',
    MANAGER = 'Gerente'
}

export enum POSITIONENUM {
    ADMIN = 'Administrador',
    MANAGER = 'Gerente',
    OPERATORMACHINEPLANE = 'Operador maquina plana',
    OPERATORMANUAL = 'Operador manual',
    OPERATORCUT = 'Operador corte',
}