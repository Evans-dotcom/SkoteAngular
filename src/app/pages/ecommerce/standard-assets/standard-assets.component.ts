import { Component, OnInit } from '@angular/core';
import { StandardAsset, StandardAssetService } from './standardassets.service';

@Component({
  selector: 'app-standard-asset',
  templateUrl: './standard-assets.component.html',
  styleUrls: ['./standard-assets.component.scss']
})
export class StandardAssetComponent implements OnInit {
  assets: StandardAsset[] = [];
  selected: StandardAsset = this.emptyAsset();
  isEdit = false;

  departments: string[] = [
    'Agriculture, Livestock and Co-operative Management',
    'Health Services',
    'Water, Environment, Energy and natural resources',
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports',
    'Public Works, Roads and Transport',
    'Public Service Management',
    'Trade, Industrialization, Tourism and wildlife',
    'Finance and Economic Planning',
    'Education, Culture and Social Services',
    'Lands, Housing and Physical Planning'
  ];

  unitsMap: { [key: string]: string[] } = {
    'Agriculture, Livestock and Co-operative Management': ['Crop Management', 'Veterinary', 'Fisheries'],
    'Health Services': ['Clinic', 'Pharmacy', 'Nursing'],
    'Water, Environment, Energy and natural resources': ['Water Supply', 'Forestry', 'Conservation'],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': ['ICT', 'Youth Affairs', 'Sports'],
    'Public Works, Roads and Transport': ['Roads', 'Transport', 'Maintenance'],
    'Public Service Management': ['HR', 'Administration'],
    'Trade, Industrialization, Tourism and wildlife': ['Trade', 'Tourism', 'Wildlife'],
    'Finance and Economic Planning': ['Accounts', 'Procurement', 'Audit'],
    'Education, Culture and Social Services': ['Schools', 'Culture', 'Social Work'],
    'Lands, Housing and Physical Planning': ['Survey', 'Housing', 'Planning']
  };

  units: string[] = [];

  constructor(private service: StandardAssetService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => (this.assets = data));
  }

  save() {
    if (this.isEdit && this.selected.id) {
      this.service.update(this.selected.id, this.selected).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    } else {
      this.service.create(this.selected).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    }
  }

  edit(item: StandardAsset) {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number) {
    if (id && confirm('Delete this asset?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyAsset();
    this.isEdit = false;
    this.units = [];
  }

  emptyAsset(): StandardAsset {
    return {
      assetDescription: '',
      serialNumber: '',
      makeModel: '',
      tagNumber: '',
      pvNumber: '',
      purchaseAmount: 0,
      depreciationRate: 0,
      annualDepreciation: 0,
      accumulatedDepreciation: 0,
      netBookValue: 0,
      responsibleOfficer: '',
      location: '',
      assetCondition: '',
      notes: '',
      department: '',
      departmentUnit: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
