// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { AddSalesComponent } from './add-sale.component';
// import { SaleEffects, SalesService, salesReducer  } from '../../../core/sales'
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../../core/_base/crud/';
import { PopupAddPproductModule } from '../../popup-product/popup-add-product/popup-add-product.module'


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
		component: AddSalesComponent
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
		// StoreModule.forFeature('sales', salesReducer),
		// EffectsModule.forFeature([SaleEffects]),
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
		AddSalesComponent,
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		// SalesService
	],
	declarations: [
		AddSalesComponent,
		// PopupAddProductComponent
		// AddSalesComponent,
		
	],
	entryComponents: [
		
	]
})

export class AddSalesModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AddSalesModule,
			providers: [
				// SalesService
			]
		};
	}
}