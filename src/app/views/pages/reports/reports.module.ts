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
import { ReportsService } from '../../../core/reports'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


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

 import { MatFileUploadModule } from 'angular-material-fileupload'

 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//component
 import { ReportsComponent } from './reports.component';
import { ActionNotificationComponent } from '../../partials/content/crud';

import { from } from 'rxjs';

const routes: Routes = [
	{
		path: '',
		component: ReportsComponent,
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
    MatFileUploadModule,
    NgxDaterangepickerMd.forRoot()
	],
	exports:[
		ReportsComponent,
	],
	providers: [
	],
	entryComponents: [
		ActionNotificationComponent,

	],
	declarations: [
		ReportsComponent,
	]
})

export class ReportsModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ReportsModule,
			providers: [
        ReportsService
			]
		};
	}
}