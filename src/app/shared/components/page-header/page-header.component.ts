import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

export interface HeaderAction {
  label: string;
  icon: string;
  cssClass: string;
  action: string;
}

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Input() actions: HeaderAction[] = [];
  @Input() showBackButton: boolean = false;
  
  @Output() actionClick = new EventEmitter<string>();
  @Output() backClick = new EventEmitter<void>();

  onActionClick(action: string) {
    this.actionClick.emit(action);
  }

  onBackClick() {
    this.backClick.emit();
  }
}