// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardEffects, DashboardService, purchasesReducer } from '../../../core/dashboard'
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
import { 
	MatIconModule,
	MatListModule,
	MatTabsModule,
	MatProgressSpinnerModule,
	MatCardModule
 } from '@angular/material';

 import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent
	},
];

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild(routes),
		MatTabsModule,
		TranslateModule.forChild(),
		StoreModule.forFeature('dashboardPurchases', purchasesReducer),
		EffectsModule.forFeature([DashboardEffects]),
		MatIconModule,
		MatListModule,
		MatProgressSpinnerModule, 
		MatCardModule,
		NgbModule.forRoot()
	],
	exports:[DashboardComponent],
	providers: [
		InterceptService,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: InterceptService,
		// 	multi: true
		// },
		DashboardService
	],
	declarations: [
		DashboardComponent,
	]
})

export class DashboardModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: DashboardModule,
			providers: [
				DashboardService
			]
		};
	}
}
