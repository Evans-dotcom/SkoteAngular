import { Component, OnInit } from '@angular/core';
import { BiologicalAsset, BiologicalAssetService } from './biological-assets.service';

@Component({
  selector: 'app-biological-asset',
  templateUrl: './biological-assets.component.html',
  styleUrls: ['./biological-assets.component.scss']
})
export class BiologicalAssetComponent implements OnInit {
  assets: BiologicalAsset[] = [];
  selected: BiologicalAsset = this.emptyAsset();
  isEdit = false;

  // ✅ Standardized Departments
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

  // ✅ Units mapped
  unitsMap: { [key: string]: string[] } = {
    'Agriculture, Livestock and Co-operative Management': ['Crop Management', 'Livestock', 'Fisheries', 'Co-operatives'],
    'Health Services': ['Clinical Services', 'Nursing', 'Pharmacy', 'Public Health'],
    'Water, Environment, Energy and natural resources': ['Water Supply', 'Sanitation', 'Forestry', 'Energy'],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': ['ICT Infrastructure', 'E-Government', 'Youth Affairs', 'Sports'],
    'Public Works, Roads and Transport': ['Roads Maintenance', 'Transport', 'Mechanical'],
    'Public Service Management': ['HRM', 'Administration', 'Procurement'],
    'Trade, Industrialization, Tourism and wildlife': ['Trade Development', 'Industrialization', 'Tourism', 'Wildlife'],
    'Finance and Economic Planning': ['Accounts', 'Audit', 'Procurement', 'Planning'],
    'Education, Culture and Social Services': ['Early Childhood Education', 'Culture', 'Social Services'],
    'Lands, Housing and Physical Planning': ['Survey', 'Physical Planning', 'Housing']
  };

  units: string[] = [];

  constructor(private service: BiologicalAssetService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.assets = data);
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

  edit(item: BiologicalAsset) {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number) {
    if (id && confirm('Delete this biological asset?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyAsset();
    this.units = [];
    this.isEdit = false;
  }

  emptyAsset(): BiologicalAsset {
    return {
      assetType: '',
      quantity: 0,
      acquisitionDate: new Date(),
      location: '',
      value: 0,
      notes: '',
      department: '',
      departmentUnit: '',
      contractDate: new Date()
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
