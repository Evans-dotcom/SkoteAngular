export interface AssetTransfer {
    id: number;
  assetId: number;
  fromDepartment: string;
  toDepartment: string;
  dateTransferred: Date;
  approvedBy: string;
  remarks: string;
}
