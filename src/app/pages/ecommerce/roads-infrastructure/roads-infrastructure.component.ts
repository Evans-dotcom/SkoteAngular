import { Component, OnInit } from '@angular/core';
import { RoadsInfrastructure, RoadsInfrastructureService } from './roads-infrastructure.service';

@Component({
  selector: 'app-roads-infrastructure',
  templateUrl: './roads-infrastructure.component.html',
  styleUrls: ['./roads-infrastructure.component.scss']
})
export class RoadsInfrastructureComponent implements OnInit {
  roads: RoadsInfrastructure[] = [];
  selectedRoad: RoadsInfrastructure = this.emptyRoad();
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

  constructor(private service: RoadsInfrastructureService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.roads = data);
  }

  save() {
    if (this.isEdit && this.selectedRoad.id) {
      this.service.update(this.selectedRoad.id, this.selectedRoad).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    } else {
      this.service.create(this.selectedRoad).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    }
  }

  edit(item: RoadsInfrastructure) {
    this.selectedRoad = { ...item };
    this.onDepartmentChange();
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this record?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selectedRoad = this.emptyRoad();
    this.units = [];
    this.isEdit = false;
  }

  emptyRoad(): RoadsInfrastructure {
    return {
      roadName: '',
      location: '',
      lengthKm: 0,
      constructionCost: 0,
      yearConstructed: new Date().getFullYear(),
      remarks: '',
      department: '',
      departmentUnit: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selectedRoad.department] || [];
    this.selectedRoad.departmentUnit = '';
  }
}
