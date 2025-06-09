export interface StocksRegister {
    id: number;
  itemName: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  location: string;
  lastRestocked: Date;
  remarks: string;
}
