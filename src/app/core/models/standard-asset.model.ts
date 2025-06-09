export interface StandardAsset {
     id: number;
  assetDescription: string;
  serialNumber: string;
  makeModel: string;
  tagNumber: string;
  deliveryDate: Date;
  pvNumber: string;
  purchaseAmount: number;
  depreciationRate: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  responsibleOfficer: string;
  location: string;
  assetCondition: string;
  notes: string;
}
