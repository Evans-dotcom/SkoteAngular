export interface AssetMovement {
    id: number;
  assetId: number;
  fromLocation: string;
  toLocation: string;
  dateMoved: Date;
  movedBy: string;
  remarks: string;
}
