import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products/products.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { ShopsComponent } from './shops/shops.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { AddDriverComponent } from './drivers/driver.component';
import { AddCustomerComponent } from './Customers1/customers1.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { StandardAssetComponent } from './standard-assets/standard-assets.component';
import { PlantMachineryComponent } from './plant-machinery/plant-machinery.component';
import { ImprestComponent } from './imprests/imprests.component';
import { MotorVehicleComponent } from './motor-vehicles/motor-vehicles.component';
import { RoadsInfrastructureComponent } from './roads-infrastructure/roads-infrastructure.component';
import { StocksRegisterComponent } from './stocks-register/stocks-register.component';
import { LeaseComponent } from './leases/leases.component';
import { WorkInProgressComponent } from './work-in-progress/work-in-progress.component';
import { SubsoilAssetComponent } from './subsoil-assets/subsoil-assets.component';
import { LandRegisterComponent } from './land-register/land-register.component';
import { InvestmentsComponent } from './investments/investments.component';
import { FurnitureFittingComponent } from './furniture-fittings/furniture-fittings.component';
import { AccountsPayableComponent } from './accounts-payable/accounts-payable.component';
import { AccountsReceivableComponent } from './accounts-receivable/accounts-receivable.component';
import { AssetHandoverComponent } from './asset-handovers/asset-handovers.component';
import { AssetMovementComponent } from './asset-movements/asset-movements.component';
import { AssetReconciliationComponent } from './asset-reconciliations/asset-reconciliations.component';
import { AssetTransferComponent } from './asset-transfers/asset-transfers.component';
import { BiologicalAssetComponent } from './biological-assets/biological-assets.component';
import { BuildingsRegisterComponent } from './buildings-register/buildings-register.component';
import { EquipmentSignoutComponent } from './equipment-signouts/equipment-signouts.component';
import { IntangibleAssetComponent } from './intangible-assets/intangible-assets.component';
import { MajorMaintenanceComponent } from './major-maintenance/major-maintenance.component';
import { OtherInfrastructureComponent } from './other-infrastructure/other-infrastructure.component';
import { LitigationComponent } from './litigation/litigation.component';
import { PortableItemsComponent } from './portable-items/portable-items.component';

const routes: Routes = [
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'product-detail/:id',
        component: ProductdetailComponent
    },
    {
        path: 'shops',
        component: ShopsComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },


    {
        path: 'customers',
        component: CustomersComponent
    },
    {
        path: 'Customers1',
        component: AddCustomerComponent
    },
    {
        path: 'drivers',
        component: AddDriverComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    },
    {
        path: 'bankaccount',
        component: BankAccountComponent
    },
     {
        path: 'banklist',
        component: BankAccountComponent
    },
    {
        path: 'standardassets',
        component: StandardAssetComponent
    },
    {
        path: 'vehicles',
        component: MotorVehicleComponent
    },
    {
        path: 'plantMachinery',
        component: PlantMachineryComponent
    },
     {
        path: 'furniturefittings',
        component: FurnitureFittingComponent
    },
    {
        path: 'imprest',
        component: ImprestComponent
    },
     {
        path: 'investments',
        component: InvestmentsComponent
    },
     {
        path: 'roadsInfrastructure',
        component: RoadsInfrastructureComponent
    },
     {
        path: 'landsregister',
        component: LandRegisterComponent
    },
    {
        path: 'litigation',
        component: LitigationComponent
    },
     {
        path: 'stockregister',
        component: StocksRegisterComponent
    },
    {
        path: 'lease',
        component: LeaseComponent
    },
    { path: 'workinprogress',
        component: WorkInProgressComponent
    },
    {
        path: 'subsoilassets',
        component: SubsoilAssetComponent
    },
     {
        path: 'accountspayable',
        component: AccountsPayableComponent
    },
    {
        path: 'accountsreceivable',
        component: AccountsReceivableComponent
    },
     {
        path: 'assethandover',
        component: AssetHandoverComponent
    },
     {
        path: 'assetmovements',
        component: AssetMovementComponent
    },
    {
        path: 'assetreconciliations',
        component: AssetReconciliationComponent
    },
     {
        path: 'assettransfers',
        component: AssetTransferComponent
    },
     {
        path: 'biologicalassets',
        component: BiologicalAssetComponent
    },
     {
        path: 'buildingsregister',
        component: BuildingsRegisterComponent
    },
    {
        path: 'equipment-signout',
        component: EquipmentSignoutComponent
    },
    {
        path: 'intangibleassets',
        component: IntangibleAssetComponent
    },
    {
        path: 'major-maintenance',
        component: MajorMaintenanceComponent
    },
     {
        path: 'otherinfrastructure',
        component: OtherInfrastructureComponent
    },
    {
        path: 'portable-items',
        component: PortableItemsComponent
    }



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
