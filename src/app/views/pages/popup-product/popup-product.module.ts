// Angular
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
// Translate
import { TranslateModule } from '@ngx-translate/core';
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

//other component
import { PopupProductComponent } from './popup-product.component'
import { PopupAddProductComponent } from '../popup-product/popup-add-product/popup-add-product.component';
import { PopupProductTotalCalculationComponent } from '../popup-product/popup-add-product/popup-product-total-calculation/popup-product-total-calculation.component'

@NgModule({
	declarations: [
		PopupProductComponent,
		PopupAddProductComponent,
		PopupProductTotalCalculationComponent,
	],
	exports: [
		PopupProductComponent,
		PopupAddProductComponent,
		PopupProductTotalCalculationComponent,
	],
	entryComponents: [
		PopupProductComponent,
		PopupProductTotalCalculationComponent
	],
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		TranslateModule.forChild(),
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

export class PopupProductModule {
}
