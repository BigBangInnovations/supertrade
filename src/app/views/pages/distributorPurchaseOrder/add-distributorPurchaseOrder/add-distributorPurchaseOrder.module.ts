// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { AddDistributorPurchaseOrderComponent } from './add-distributorPurchaseOrder.component';
// import { DistributorPurchaseOrderEffects, DistributorPurchaseOrderService, distributorPurchaseOrderReducer  } from '../../../core/distributorPurchaseOrder'
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../../core/_base/crud/';
import { PopupProductModule } from '../../popup-product/popup-product.module'
import { DistributorService } from '../../../../core/distributor'
import { NgSelectModule } from '@ng-select/ng-select';

import { 
	MatIconModule,
	MatListModule,
	MatTabsModule,
	MatProgressSpinnerModule,
	MatCardModule,
	MatTableModule,
	MatPaginatorModule,
	MatFormFieldModule,
	MatInputModule,
	MatSortModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatNativeDateModule,
	MatRadioModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
 } from '@angular/material';

 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
//  import { PopupAddProductComponent } from '../../popup-product/popup-add-product/popup-add-product.component'

const routes: Routes = [
	{
		path: '',
		component: AddDistributorPurchaseOrderComponent
	},
];

@NgModule({
	imports: [
		PopupProductModule,
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild(routes),
		MatTabsModule,
		TranslateModule.forChild(),
		// StoreModule.forFeature('distributorPurchaseOrder', distributorPurchaseOrderReducer),
		// EffectsModule.forFeature([DistributorPurchaseOrderEffects]),
		MatIconModule,
		MatListModule,
		MatProgressSpinnerModule,
		MatCardModule,
		NgbModule.forRoot(),
		MatTableModule,
		MatPaginatorModule,
		MatFormFieldModule,
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatSortModule,
		MatCheckboxModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTooltipModule,
		MatDialogModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule
	],
	exports:[
		AddDistributorPurchaseOrderComponent,
	],
	providers: [
		InterceptService,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: InterceptService,
		// 	multi: true
		// },
		// DistributorPurchaseOrderService
		DistributorService,
	],
	declarations: [
		AddDistributorPurchaseOrderComponent,
		// PopupAddProductComponent
		// AddDistributorPurchaseOrderComponent,
		
	],
	entryComponents: [
		
	]
})

export class AddDistributorPurchaseOrderModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AddDistributorPurchaseOrderModule,
			providers: [
				// DistributorPurchaseOrderService
				DistributorService,
			]
		};
	}
}