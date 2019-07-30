// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DistributorSaleEffects, DistributorSaleService, distributorSaleReducer  } from '../../../core/distributorSale'
import { ProductEffects, productReducer, ProductService } from '../../../core/product'
import { RetailerEffects, retailerReducer, RetailerService } from '../../../core/retailer'
import { OrderselectEffects, orderselectReducer } from '../../../core/orderselect'
import { OrderService } from '../../../core/order';
import { MetadataEffects, MetadataService, metadataReducer } from '../../../core/metadata'
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
	MatTooltipModule,	
	MatButtonToggleModule,
	MatSlideToggleModule
 } from '@angular/material';

 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

//component
 import { DistributorSaleListComponent } from './distributorSale.component';
import { ActionNotificationComponent } from '../../partials/content/crud';
import { ViewDistributorSaleComponent } from './view-distributorSale/view-distributorSale.component';

import { PopupProductModule } from '../popup-product/popup-product.module'
import { from } from 'rxjs';

const routes: Routes = [
	{
		path: '',
		component: DistributorSaleListComponent,
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
		//distributorSale
		StoreModule.forFeature('distributorSale', distributorSaleReducer),
		EffectsModule.forFeature([DistributorSaleEffects]),
		//product
		EffectsModule.forFeature([ProductEffects]),
		StoreModule.forFeature('product', productReducer),
		//distributor
		EffectsModule.forFeature([RetailerEffects]),
		StoreModule.forFeature('retailer', retailerReducer),
		//orderSelect
		EffectsModule.forFeature([OrderselectEffects]),
		StoreModule.forFeature('orderselect', orderselectReducer),

		//metadata
		EffectsModule.forFeature([MetadataEffects]),
		StoreModule.forFeature('metadata', metadataReducer),

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
		NgxMatSelectSearchModule,
		MatButtonToggleModule,
		MatSlideToggleModule
	],
	exports:[
		DistributorSaleListComponent,
		ViewDistributorSaleComponent,
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},		
		// DistributorSaleService,
		ProductService,
		RetailerService,
		OrderService,
		MetadataService,
	],
	entryComponents: [
		ActionNotificationComponent,
		ViewDistributorSaleComponent,

	],
	declarations: [
		DistributorSaleListComponent,
		ViewDistributorSaleComponent,
	]
})

export class DistributorSaleModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: DistributorSaleModule,
			providers: [
				// DistributorSaleService,
				ProductService,
				RetailerService,
				OrderService,
				MetadataService,
			]
		};
	}
}