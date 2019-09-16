// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard, ModuleGuard } from '../../../core/auth';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('../../../../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('../../../../app/views/themes/demo1/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'sales',
				canActivate: [ModuleGuard],
				data: { moduleName: 'sales' },
				loadChildren: () => import('../../../../app/views/pages/sales/sales.module').then(m => m.SalesModule)
			},
			{
				path: 'add-sale',
				canActivate: [ModuleGuard],
				data: { moduleName: 'sales' },
				loadChildren: () => import('../../../../app/views/pages/sales/add-sale/add-sale.module').then(m => m.AddSalesModule)
			},
			{
				path: 'purchase',
				canActivate: [ModuleGuard],
				data: { moduleName: 'purchase' },
				loadChildren: () => import('../../../../app/views/pages/purchase/purchase.module').then(m => m.PurchaseModule)
			},
			{
				path: 'add-purchase',
				canActivate: [ModuleGuard],
				data: { moduleName: 'purchase' },
				loadChildren: () => import('../../../../app/views/pages/purchase/add-purchase/add-purchase.module').then(m => m.AddPurchaseModule)
			},
			{
				path: 'order',
				loadChildren: () => import('../../../../app/views/pages/order/order.module').then(m => m.OrderModule)
			},
			{
				path: 'add-order',
				loadChildren: () => import('../../../../app/views/pages/order/add-order/add-order.module').then(m => m.AddOrderModule)
			},
			{
				path: 'distributor-purchase-order',
				loadChildren: () => import('../../../../app/views/pages/distributorPurchaseOrder/distributorPurchaseOrder.module').then(m => m.DistributorPurchaseOrderModule)
			},
			{
				path: 'add-distributor-purchase-order',
				loadChildren: () => import('../../../../app/views/pages/distributorPurchaseOrder/add-distributorPurchaseOrder/add-distributorPurchaseOrder.module').then(m => m.AddDistributorPurchaseOrderModule)
			},
			{
				path: 'notification',
				loadChildren: () => import('../../../../app/views/pages/notification/notification.module').then(m => m.NotificationModule)
			},
			{
				path: 'distributor-sales',
				canActivate: [ModuleGuard],
				data: { moduleName: 'distributorSale' },
				loadChildren: () => import('../../../../app/views/pages/distributorSale/distributorSale.module').then(m => m.DistributorSaleModule)
			},
			{
				path: 'add-distributor-sale',
				canActivate: [ModuleGuard],
				data: { moduleName: 'distributorSale' },
				loadChildren: () => import('../../../../app/views/pages/distributorSale/add-distributorSale/add-distributorSale.module').then(m => m.AddDistributorSaleModule)
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}