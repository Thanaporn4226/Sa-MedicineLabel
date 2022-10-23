import { StorageInterface } from "./IStorage";
import { TypeInterface } from "./IType";
import { EmployeeInterface } from "./IEmployees";

export interface MedicineInterface {
    ID: number,
    Name:   string,
	MFD:    Date,
	EXP:    Date,
	Amount: number,

	EmployeeID: number,
	Employee:   EmployeeInterface,

	TypeID: number,
	Type:   TypeInterface,

	StorageID: number,
	Storage:    StorageInterface
}