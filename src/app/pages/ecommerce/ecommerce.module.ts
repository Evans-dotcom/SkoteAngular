import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { Ng5SliderModule } from 'ng5-slider';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductsComponent } from './products/products.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { ShopsComponent } from './shops/shops.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { AddDriverComponent } from './drivers/driver.component';
import { AddCustomerComponent } from './Customers1/customers1.component';
 import { BankAccountComponent } from './bank-account/bank-account.component';
import { AccountListComponent } from './bank-account/account-list/account-list.component';
import { PlantMachineryComponent } from './plant-machinery/plant-machinery.component';
import { PortableItemsComponent } from './portable-items/portable-items.component';
import { LandRegisterComponent } from './land-register/land-register.component';
import { BuildingsRegisterComponent } from './buildings-register/buildings-register.component';
import { IntangibleAssetsComponent } from './intangible-assets/intangible-assets.component';
import { StocksRegisterComponent } from './stocks-register/stocks-register.component';
import { RoadsInfrastructureComponent } from './roads-infrastructure/roads-infrastructure.component';
import { OtherInfrastructureComponent } from './other-infrastructure/other-infrastructure.component';
import { BiologicalAssetsComponent } from './biological-assets/biological-assets.component';
import { SubsoilAssetsComponent } from './subsoil-assets/subsoil-assets.component';
import { MajorMaintenanceComponent } from './major-maintenance/major-maintenance.component';
import { WorkInProgressComponent } from './work-in-progress/work-in-progress.component';
import { InvestmentsComponent } from './investments/investments.component';
import { AccountsReceivableComponent } from './accounts-receivable/accounts-receivable.component';
import { OtherReceivablesComponent } from './other-receivables/other-receivables.component';
import { AccountsPayableComponent } from './accounts-payable/accounts-payable.component';
import { AssetMovementsComponent } from './asset-movements/asset-movements.component';
import { RevaluationsComponent } from './revaluations/revaluations.component';
import { LossesRegisterComponent } from './losses-register/losses-register.component';
import { LeasesComponent } from './leases/leases.component';
import { LitigationComponent } from './litigation/litigation.component';
import { EquipmentSignoutsComponent } from './equipment-signouts/equipment-signouts.component';
import { AssetTransfersComponent } from './asset-transfers/asset-transfers.component';
import { AssetHandoversComponent } from './asset-handovers/asset-handovers.component';
import { AssetReconciliationsComponent } from './asset-reconciliations/asset-reconciliations.component';
import { StandardAssetComponent } from './standard-assets/standard-assets.component';
import { ImprestComponent } from './imprests/imprests.component';
import { MotorVehicleComponent } from './motor-vehicles/motor-vehicles.component';
import { FurnitureFittingComponent } from './furniture-fittings/furniture-fittings.component';

const config: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 100,
};

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [ProductsComponent , AddDriverComponent,AddCustomerComponent,
    AddproductComponent,ProductdetailComponent,
     ShopsComponent, CheckoutComponent, CartComponent, CustomersComponent, OrdersComponent, BankAccountComponent, AccountListComponent, FurnitureFittingComponent, PlantMachineryComponent, PortableItemsComponent, MotorVehicleComponent, LandRegisterComponent, BuildingsRegisterComponent, IntangibleAssetsComponent, ImprestComponent,StocksRegisterComponent, RoadsInfrastructureComponent, OtherInfrastructureComponent, BiologicalAssetsComponent, SubsoilAssetsComponent, MajorMaintenanceComponent, WorkInProgressComponent, InvestmentsComponent, StandardAssetComponent, AccountsReceivableComponent, OtherReceivablesComponent,  AccountsPayableComponent, AssetMovementsComponent, RevaluationsComponent, LossesRegisterComponent, LeasesComponent, LitigationComponent, EquipmentSignoutsComponent, AssetTransfersComponent, AssetHandoversComponent, AssetReconciliationsComponent],
  imports: [
    CommonModule,
    EcommerceRoutingModule,
    NgbNavModule,
    NgbModalModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgbDropdownModule,
    DropzoneModule,
    ReactiveFormsModule,
    UIModule,
    WidgetModule,
    Ng5SliderModule,
    NgSelectModule,
    NgbPaginationModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: config
    }
  ]
})
export class EcommerceModule { }
