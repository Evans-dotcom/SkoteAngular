export interface MajorMaintenance {
    id: number;
  assetId: number;
  maintenanceType: string;
  dateStarted: Date;
  dateCompleted: Date;
  cost: number;
  remarks: string;
}
