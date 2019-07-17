// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupAddProductComponent } from './popup-add-product.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Partials
import { 
	MatIconModule,
	MatTabsModule,
	MatProgressSpinnerModule,
	MatCardModule,
	MatListModule,
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

import { PopupProductTotalCalculationComponent } from '../../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'

@NgModule({
	declarations: [
		PopupAddProductComponent,
		PopupProductTotalCalculationComponent,
	],
	exports: [
		PopupAddProductComponent,
		PopupProductTotalCalculationComponent,
	],
	entryComponents: [
		PopupProductTotalCalculationComponent
	],
	imports: [
		CommonModule,
		MatTabsModule,
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
		MatIconModule,
		MatProgressSpinnerModule,
		MatCardModule,
		MatListModule,
	],
	providers: []
})
export class PopupAddPproductModule {
}
