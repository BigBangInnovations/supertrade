// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DistributorPurchaseOrderEffects, DistributorPurchaseOrderService, distributorPurchaseOrderReducer  } from '../../../core/distributorPurchaseOrder';
import { ProductEffects, productReducer, ProductService } from '../../../core/product';
import { DistributorEffects, distributorReducer, DistributorService } from '../../../core/distributor';
import { VendorEffects, vendorReducer, VendorService } from '../../../core/vendor';

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
	MatTooltipModule
 } from '@angular/material';

 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

//component
 import { DistributorPurchaseOrderListComponent } from './distributorPurchaseOrder.component';
import { ActionNotificationComponent } from '../../partials/content/crud';
import { ViewDistributorPurchaseOrderComponent } from './view-distributorPurchaseOrder/view-distributorPurchaseOrder.component';

import { PopupProductModule } from '../popup-product/popup-product.module'
import { from } from 'rxjs';

const routes: Routes = [
	{
		path: '',
		component: DistributorPurchaseOrderListComponent,
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
		//distributorPurchaseOrder
		StoreModule.forFeature('distributorPurchaseOrder', distributorPurchaseOrderReducer),
		EffectsModule.forFeature([DistributorPurchaseOrderEffects]),
		//product
		EffectsModule.forFeature([ProductEffects]),
		StoreModule.forFeature('product', productReducer),
		//distributor
		EffectsModule.forFeature([DistributorEffects]),
		StoreModule.forFeature('distributor', distributorReducer),
		//vendor
		EffectsModule.forFeature([VendorEffects]),
		StoreModule.forFeature('vendor', vendorReducer),
		
		
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
		NgxMatSelectSearchModule
	],
	exports:[
		DistributorPurchaseOrderListComponent,
		ViewDistributorPurchaseOrderComponent,
	],
	providers: [
		InterceptService,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: InterceptService,
		// 	multi: true
		// },		
		ProductService,
		DistributorService,
		VendorService,
		// DistributorPurchaseOrderService
	],
	entryComponents: [
		ActionNotificationComponent,
		ViewDistributorPurchaseOrderComponent,
	],
	declarations: [
		DistributorPurchaseOrderListComponent,
		ViewDistributorPurchaseOrderComponent,
	]
})

export class DistributorPurchaseOrderModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: DistributorPurchaseOrderModule,
			providers: [
				ProductService,
				DistributorService,
				VendorService,
				// DistributorPurchaseOrderService,

			]
		};
	}
}