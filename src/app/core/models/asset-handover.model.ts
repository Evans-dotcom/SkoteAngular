export interface AssetHandover {
    id: number;
  assetId: number;
  fromEmployee: string;
  toEmployee: string;
  department: string;
  dateHandedOver: Date;
  condition: string;
  remarks: string;
}
