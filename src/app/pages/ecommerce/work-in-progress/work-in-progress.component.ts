import { Component, OnInit } from '@angular/core';
import { WorkInProgress, WorkInProgressService } from './work-in-progress.service';

@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss']
})
export class WorkInProgressComponent implements OnInit {
  works: WorkInProgress[] = [];
  selected: WorkInProgress = this.emptyForm();
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

  // ✅ Units map for cascading dropdown
  unitsMap: { [key: string]: string[] } = {
    'Agriculture, Livestock and Co-operative Management': ['Livestock', 'Crop Production', 'Fisheries'],
    'Health Services': ['Hospitals', 'Clinics', 'Public Health'],
    'Water, Environment, Energy and natural resources': ['Water Supply', 'Forestry', 'Environment'],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': ['ICT', 'Youth Affairs', 'Sports'],
    'Public Works, Roads and Transport': ['Roads', 'Bridges', 'Transport'],
    'Public Service Management': ['HR', 'Training', 'Administration'],
    'Trade, Industrialization, Tourism and wildlife': ['Trade', 'Tourism', 'Wildlife'],
    'Finance and Economic Planning': ['Revenue', 'Accounts', 'Budgeting'],
    'Education, Culture and Social Services': ['Schools', 'Culture', 'Community'],
    'Lands, Housing and Physical Planning': ['Land Registry', 'Housing', 'Urban Planning']
  };

  units: string[] = [];

  constructor(private service: WorkInProgressService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.works = data);
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

  edit(item: WorkInProgress) {
    this.selected = { ...item };
    this.onDepartmentChange(); // reload units when editing
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Delete this Work In Progress?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyForm();
    this.units = [];
    this.isEdit = false;
  }

  emptyForm(): WorkInProgress {
    return {
      projectName: '',
      currentValue: 0,
      remarks: '',
      department: '',
      departmentUnit: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
