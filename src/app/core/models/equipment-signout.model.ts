export interface EquipmentSignout {
    id: number;
  equipmentId: number;
  issuedTo: string;
  dateIssued: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date; // Optional property
  conditionOnReturn: string;
  remarks: string;
}
