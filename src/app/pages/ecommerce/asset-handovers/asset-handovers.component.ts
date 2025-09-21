import { Component, OnInit } from '@angular/core';
import { AssetHandover, AssetHandoverService } from './asset-handover.service';

@Component({
  selector: 'app-asset-handover',
  templateUrl: './asset-handovers.component.html',
  styleUrls: ['./asset-handovers.component.scss']
})
export class AssetHandoverComponent implements OnInit {
  handovers: AssetHandover[] = [];
  selected: AssetHandover = this.emptyForm();
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

  // ✅ Units mapped per department
  unitsMap: { [key: string]: string[] } = {
    'Agriculture, Livestock and Co-operative Management': [
      'Crop Management', 'Livestock', 'Fisheries', 'Co-operatives'
    ],
    'Health Services': [
      'Clinical Services', 'Nursing', 'Pharmacy', 'Public Health'
    ],
    'Water, Environment, Energy and natural resources': [
      'Water Supply', 'Sanitation', 'Forestry', 'Energy'
    ],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': [
      'ICT Infrastructure', 'E-Government', 'Youth Affairs', 'Sports'
    ],
    'Public Works, Roads and Transport': [
      'Roads Maintenance', 'Transport', 'Mechanical'
    ],
    'Public Service Management': [
      'HRM', 'Administration', 'Procurement'
    ],
    'Trade, Industrialization, Tourism and wildlife': [
      'Trade Development', 'Industrialization', 'Tourism', 'Wildlife'
    ],
    'Finance and Economic Planning': [
      'Accounts', 'Audit', 'Procurement', 'Planning'
    ],
    'Education, Culture and Social Services': [
      'Early Childhood Education', 'Culture', 'Social Services'
    ],
    'Lands, Housing and Physical Planning': [
      'Survey', 'Physical Planning', 'Housing'
    ]
  };

  units: string[] = [];

  constructor(private service: AssetHandoverService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.handovers = data);
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

  edit(item: AssetHandover) {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number) {
    if (id && confirm('Delete this asset handover record?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyForm();
    this.isEdit = false;
    this.units = [];
  }

  emptyForm(): AssetHandover {
    return {
      assetId: 0,
      fromEmployee: '',
      toEmployee: '',
      department: '',
      departmentUnit: '',
      //contractDate: new Date(),
      //dateHandedOver: new Date(),
      condition: '',
      remarks: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
