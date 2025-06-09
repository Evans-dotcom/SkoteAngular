export interface Investment {
    id: number;
  investmentType: string;
  institution: string;
  dateInvested: Date;
  amount: number;
  expectedReturn: number;
  remarks: string;
}
