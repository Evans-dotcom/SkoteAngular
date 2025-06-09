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
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this road?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selectedRoad = this.emptyRoad();
    this.isEdit = false;
  }

  emptyRoad(): RoadsInfrastructure {
    return {
      roadName: '',
      location: '',
      lengthKm: 0,
      constructionCost: 0,
      yearConstructed: new Date().getFullYear(),
      remarks: ''
    };
  }
}
