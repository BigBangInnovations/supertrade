// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard } from '../../../core/auth';

//other component
// import { ViewSaleComponent } from '../../pages/sales/view-sale/view-sale.component'

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
				loadChildren: () => import('../../../../app/views/pages/sales/sales.module').then(m => m.SalesModule)
			},
			{
				path: 'add-sale',
				loadChildren: () => import('../../../../app/views/pages/sales/add-sale/add-sale.module').then(m => m.AddSalesModule)
			},
			// {
			// 	path: 'view-sale',
			// 	component: ViewSaleComponent 
			// },
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