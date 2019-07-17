// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
// import { SalesComponent } from './sales/sales.component';
// import { AddSalesComponent } from './sales/add-sales/add-sales.component';
// import { TransferStateInterceptor, TransferStateService } from '../../core/_base/crud/';

import { 
	MatIconModule,
	MatListModule,
	MatTabsModule,
	MatProgressSpinnerModule,
	MatCardModule

} from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PopupAddProductComponent } from './popup-product/popup-add-product/popup-add-product.component';
// import { PopupProductComponent } from './popup-product/popup-product.component';

@NgModule({
	// declarations: [SalesComponent, PopupProductComponent, PopupAddProductComponent],
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		MatIconModule,
		MatListModule,
		MatProgressSpinnerModule,
		MatCardModule,
		NgbModule.forRoot()
	],
	providers: [
		// TransferStateService,
		// // TransferStateInterceptor,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: TransferStateInterceptor,
		// 	multi: true
		// },
	]
})
export class PagesModule {
}
