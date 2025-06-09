export interface AssetReconciliation {
    id: number;
  assetId: number;
  dateReconciled: Date;
  physicalCount: number;
  systemCount: number;
  reconciledBy: string;
  discrepancy: string;
  remarks: string;
}
