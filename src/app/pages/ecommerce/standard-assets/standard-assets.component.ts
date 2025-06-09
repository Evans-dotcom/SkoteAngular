import { Component, OnInit } from '@angular/core';
import { StandardAssetService } from './standardassets.service';
import { StandardAsset } from 'src/app/core/models/standard-asset.model';

@Component({
  selector: 'app-standard-asset',
  templateUrl: './standard-assets.component.html',
  styleUrls: ['./standard-assets.component.scss']
})
export class StandardAssetComponent implements OnInit {
  standardAssets: StandardAsset[] = [];
  selectedAsset: StandardAsset = this.emptyAsset();
  isEdit = false;

  constructor(private assetService: StandardAssetService) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets() {
    this.assetService.getAll().subscribe(data => this.standardAssets = data);
  }

  saveAsset() {
    if (this.isEdit && this.selectedAsset.id) {
      this.assetService.update(this.selectedAsset.id, this.selectedAsset).subscribe(() => {
        this.resetForm();
        this.loadAssets();
      });
    } else {
      this.assetService.create(this.selectedAsset).subscribe(() => {
        this.resetForm();
        this.loadAssets();
      });
    }
  }

  edit(asset: StandardAsset) {
    this.selectedAsset = { ...asset };
    this.isEdit = true;
  }

  delete(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this asset?')) {
      this.assetService.delete(id).subscribe(() => this.loadAssets());
    }
  }

  resetForm() {
    this.selectedAsset = this.emptyAsset();
    this.isEdit = false;
  }

  emptyAsset(): StandardAsset {
    return {
      id: 0,
      assetDescription: '',
      serialNumber: '',
      makeModel: '',
      tagNumber: '',
      deliveryDate: new Date(),
      pvNumber: '',
      purchaseAmount: 0,
      depreciationRate: 0,
      annualDepreciation: 0,
      accumulatedDepreciation: 0,
      netBookValue: 0,
      responsibleOfficer: '',
      location: '',
      assetCondition: '',
      notes: ''
    };
  }
}
