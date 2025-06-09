export interface Revaluation {
    id: number;
  assetId: number;
  revaluationDate: Date;
  oldValue: number;
  newValue: number;
  reason: string;
}
