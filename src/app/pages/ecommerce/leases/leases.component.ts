import { Component, OnInit } from '@angular/core';
import { Lease } from 'src/app/core/models/lease.model';
import { LeaseService } from './lease.service';

@Component({
  selector: 'app-lease',
  templateUrl: './leases.component.html',
  styleUrls: ['./leases.component.scss']
})
export class LeaseComponent implements OnInit {
  leases: Lease[] = [];
  selected: Lease = this.emptyForm();
  isEdit = false;

  // ✅ Departments (standardized across system)
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

  constructor(private service: LeaseService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe({
      next: data => (this.leases = data),
      error: err => console.error('Failed to load leases', err)
    });
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

  edit(item: Lease): void {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number): void {
    if (id && confirm('Delete this lease record?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  onDepartmentChange(): void {
    this.units = this.unitsMap[this.selected.department] || [];
    if (!this.units.includes(this.selected.departmentUnit)) {
      this.selected.departmentUnit = '';
    }
  }

  resetForm(): void {
    this.selected = this.emptyForm();
    this.isEdit = false;
    this.units = [];
  }

  emptyForm(): Lease {
    return {
      id: 0,
      leaseItem: '',
      lessor: '',
      //leaseStart: new Date(),
      //leaseEnd: new Date(),
      leaseCost: 0,
      remarks: '',
      department: '',
      departmentUnit: ''
    };
  }
}
