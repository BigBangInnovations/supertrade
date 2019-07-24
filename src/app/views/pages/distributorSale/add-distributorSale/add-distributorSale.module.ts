// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { AddDistributorSaleComponent } from './add-distributorSale.component';
// import { DistributorSaleEffects, DistributorSaleService, distributorSaleReducer  } from '../../../core/distributorSale'
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../../core/_base/crud/';
import { PopupProductModule } from '../../popup-product/popup-product.module'


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
		component: AddDistributorSaleComponent
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
		// StoreModule.forFeature('distributorSale', distributorSaleReducer),
		// EffectsModule.forFeature([DistributorSaleEffects]),
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
	],
	exports:[
		AddDistributorSaleComponent,
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		// DistributorSaleService
	],
	declarations: [
		AddDistributorSaleComponent,
		// PopupAddProductComponent
		// AddDistributorSaleComponent,
		
	],
	entryComponents: [
		
	]
})

export class AddDistributorSaleModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AddDistributorSaleModule,
			providers: [
				// DistributorSaleService
			]
		};
	}
}