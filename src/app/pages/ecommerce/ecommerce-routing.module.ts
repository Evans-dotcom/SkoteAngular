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
        path: 'imprest',
        component: ImprestComponent
    },
     {
        path: 'roadsInfrastructure',
        component: RoadsInfrastructureComponent
    },
     {
        path: 'stockregister',
        component: StocksRegisterComponent
    },

    




];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
