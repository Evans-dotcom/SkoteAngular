import { Component, OnInit } from '@angular/core';
import { CustomerService } from './customers1.service';  // Create a CustomerService for API handling
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-customer',
  templateUrl: './customers1.component.html',
  styleUrls: ['./customers1.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  customers: any[] = [];
  pagedCustomers: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10; // Display 10 customers per page
  totalCustomers: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private customerService: CustomerService) {}  // Inject CustomerService

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.isLoading = true;0
    this.customerService.getCustomers().pipe(
      catchError(error => {
        console.error('Error retrieving customers', error);
        this.errorMessage = `Failed to load customers: ${error.message || 'Unknown error'}`;
        this.isLoading = false;
        return of([]);  // Return an empty array on error
      })
    ).subscribe(data => {
      this.customers = data;
      this.totalCustomers = this.customers.length;
      this.updatePagedCustomers();
      this.successMessage = 'Customers loaded successfully.';
      this.isLoading = false;
    });
  }

  updatePagedCustomers(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedCustomers = this.customers.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.updatePagedCustomers();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage--;
      this.updatePagedCustomers();
    }
  }

  hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.totalCustomers;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }
}
