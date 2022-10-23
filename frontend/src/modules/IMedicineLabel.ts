import { EmployeeInterface } from "./IEmployees";
import { MedicineUseInterface } from "./IMedicineUse";
import { WarningInterface } from "./IWarning";

export interface MedicineLabelInterface {
    ID?: number,
    RecordingDate? : Date | null,
    MedicineUseID?: number,
    MedicineUse?: MedicineUseInterface,
    WarningID?: number,
	Warning?: WarningInterface,
    EmployeeID?: number,
	Employee?: EmployeeInterface,

}