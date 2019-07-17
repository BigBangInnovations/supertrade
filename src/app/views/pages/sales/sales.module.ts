// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { SaleEffects, SalesService, salesReducer  } from '../../../core/sales'
import { ProductEffects, productReducer } from '../../../core/product'
import { ProductService } from '../../../core/product'
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
 import { SalesListComponent } from './sales.component';
//  import { AddSalesComponent } from './add-sale/add-sale.component';
import { PopupProductComponent } from '../popup-product/popup-product.component';
// import { PopupAddProductComponent } from '../popup-product/popup-add-product/popup-add-product.component';
import { ActionNotificationComponent } from '../../partials/content/crud';
import { ViewSaleComponent } from './view-sale/view-sale.component';

import { PopupAddPproductModule } from '../popup-product/popup-add-product/popup-add-product.module'
import { from } from 'rxjs';

const routes: Routes = [
	{
		path: '',
		component: SalesListComponent,
		// children: [
		// 	{
		// 		path: 'add-sale',
		// 		component: AddSalesComponent
		// 	},
		// ]
	},
	
];

@NgModule({
	imports: [
		PopupAddPproductModule,
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild(routes),
		MatTabsModule,
		TranslateModule.forChild(),
		//sales
		StoreModule.forFeature('sales', salesReducer),
		EffectsModule.forFeature([SaleEffects]),
		//product
		EffectsModule.forFeature([ProductEffects]),
		StoreModule.forFeature('product', productReducer),

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
		SalesListComponent,
		PopupProductComponent,
		ViewSaleComponent,
		// PopupAddProductComponent,
		// AddSalesComponent
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		
		SalesService,
		ProductService
	],
	entryComponents: [
		ActionNotificationComponent,
		PopupProductComponent,
		ViewSaleComponent,
		// PopupAddProductComponent,

	],
	declarations: [
		SalesListComponent,
		PopupProductComponent,
		ViewSaleComponent,
		// PopupAddProductComponent,
		// AddSalesComponent
	]
})

export class SalesModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SalesModule,
			providers: [
				SalesService,
				ProductService
			]
		};
	}
}
