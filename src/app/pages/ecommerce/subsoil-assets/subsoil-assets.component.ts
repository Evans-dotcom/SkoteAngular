import { Component, OnInit } from '@angular/core';
import { SubsoilAsset, SubsoilAssetService } from './subsoil-asset.service';

@Component({
  selector: 'app-subsoil-asset',
  templateUrl: './subsoil-assets.component.html',
  styleUrls: ['./subsoil-assets.component.scss']
})
export class SubsoilAssetComponent implements OnInit {
  assets: SubsoilAsset[] = [];
  selected: SubsoilAsset = this.emptyForm();
  isEdit = false;

  // ✅ Departments & Units
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

  constructor(private service: SubsoilAssetService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(data => this.assets = data);
  }

  save(): void {
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

  edit(item: SubsoilAsset): void {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number): void {
    if (id && confirm('Delete this Subsoil Asset?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm(): void {
    this.selected = this.emptyForm();
    this.units = [];
    this.isEdit = false;
  }

  onDepartmentChange(): void {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }

  emptyForm(): SubsoilAsset {
    return {
      resourceType: '',
      location: '',
      estimatedVolume: '',
      ownershipStatus: '',
      valueEstimate: 0,
      remarks: '',
      department: '',
      departmentUnit: ''
    };
  }
}
