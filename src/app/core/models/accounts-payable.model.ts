export interface AccountsPayable {
    id: number;
  creditorName: string;
  amountDue: number;
  dueDate: Date;
  reason: string;
  remarks: string;
}
