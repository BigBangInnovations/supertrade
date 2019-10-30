// Angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { OpeningStockService } from '../../../core/openingStock'

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

//  import { MatFileUploadModule } from 'angular-material-fileupload'

 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//component
 import { OpeningStockComponent } from './opening-stock.component';
import { ActionNotificationComponent } from '../../partials/content/crud';

import { from } from 'rxjs';

const routes: Routes = [
	{
		path: '',
		component: OpeningStockComponent,
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
    // MatFileUploadModule
	],
	exports:[
		OpeningStockComponent,
	],
	providers: [
	],
	entryComponents: [
		ActionNotificationComponent,

	],
	declarations: [
		OpeningStockComponent,
	]
})

export class OpeningStockModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: OpeningStockModule,
			providers: [
        OpeningStockService
			]
		};
	}
}