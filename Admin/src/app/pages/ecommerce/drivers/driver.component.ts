import { Component, OnInit } from '@angular/core';
import { DriverService } from './driver.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  drivers: any[] = [];
  pagedDrivers: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10; // Number of drivers per page
  totalDrivers: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.getDrivers();
  }

  getDrivers(): void {
    this.isLoading = true;
    this.driverService.getDrivers().pipe(
      catchError(error => {
        console.error('Error retrieving drivers', error);
        this.errorMessage = `Failed to retrieve drivers: ${error.message || 'Unknown error'}`;
        return of([]);
      })
    ).subscribe(data => {
      this.drivers = data;
      this.totalDrivers = this.drivers.length;
      this.updatePagedDrivers();
      this.isLoading = false;
    });
  }

  updatePagedDrivers(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedDrivers = this.drivers.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.updatePagedDrivers();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage--;
      this.updatePagedDrivers();
    }
  }

  hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.totalDrivers;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }
}
