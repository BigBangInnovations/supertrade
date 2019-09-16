// Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig, MatProgressSpinnerModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
// Angular in memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Perfect Scroll bar
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Env
import { environment } from '../environments/environment';
// Hammer JS
import 'hammerjs';
// NGX Permissions
import { NgxPermissionsModule } from 'ngx-permissions';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// State
import { metaReducers, reducers } from './core/reducers';
// Copmponents
import { AppComponent } from './app.component';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
// Partials
import { PartialsModule } from './views/partials/partials.module';
// Layout Services
import {
	DataTableService,
	// FakeApiService,
	KtDialogService,
	LayoutConfigService,
	LayoutRefService,
	MenuAsideService,
	MenuConfigService,
	MenuHorizontalService,
	PageConfigService,
	SplashScreenService,
	SubheaderService
} from './core/_base/layout';
// Auth
import { AuthModule } from './views/pages/auth/auth.module';
import { AuthService } from './core/auth';

//Dashboard
import { DashboardModule } from './views/pages/dashboard/dashboard.module'
import { DashboardService } from './core/dashboard'

//Sales
import { SalesModule } from './views/pages/sales/sales.module'
import { SalesService } from './core/sales'

//Purchase
import { PurchaseModule } from './views/pages/purchase/purchase.module'
import { PurchaseService } from './core/purchase'

//Order
import { OrderModule } from './views/pages/order/order.module'
import { OrderService } from './core/order'

//notification
import { NotificationModule } from './views/pages/notification/notification.module'
import { NotificationService } from './core/notification'

//Distributor Sale
import { DistributorSaleModule } from './views/pages/distributorSale/distributorSale.module'
import { DistributorSaleService } from './core/distributorSale'

//Distributor Sale
import { DistributorPurchaseOrderModule } from './views/pages/distributorPurchaseOrder/distributorPurchaseOrder.module'
import { DistributorPurchaseOrderService } from './core/distributorPurchaseOrder'

// CRUD
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from './core/_base/crud';
// Config
import { LayoutConfig } from './core/_config/demo1/layout.config';
// Highlight JS
import { HIGHLIGHT_OPTIONS, HighlightLanguage } from 'ngx-highlightjs';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as xml from 'highlight.js/lib/languages/xml';
import * as json from 'highlight.js/lib/languages/json';

import { CommonModule } from '@angular/common';  

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	wheelSpeed: 0.5,
	swipeEasing: true,
	minScrollbarLength: 40,
	maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
	// initialize app by loading default demo layout config
	return () => {
		if (appConfig.getConfig() === null) {
			appConfig.loadConfigs(new LayoutConfig().configs);
		}
	};
}

export function hljsLanguages(): HighlightLanguage[] {
	return [
		{name: 'typescript', func: typescript},
		{name: 'scss', func: scss},
		{name: 'xml', func: xml},
		{name: 'json', func: json}
	];
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserAnimationsModule,
		CommonModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		// environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
		// 	passThruUnknownUrl: true,
		// 	dataEncapsulation: false
		// }) : [],
		NgxPermissionsModule.forRoot(),
		PartialsModule,
		CoreModule,
		OverlayModule,
		StoreModule.forRoot(reducers, {metaReducers}),
		EffectsModule.forRoot([]),
		StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
		StoreDevtoolsModule.instrument(),
		AuthModule.forRoot(),
		DashboardModule.forRoot(),
		SalesModule.forRoot(),
		PurchaseModule.forRoot(),
		OrderModule.forRoot(),
		NotificationModule.forRoot(),
		DistributorSaleModule.forRoot(),
		DistributorPurchaseOrderModule.forRoot(),
		TranslateModule.forRoot(),
		MatProgressSpinnerModule,
		InlineSVGModule.forRoot(),
	],
	exports: [],
	providers: [
		AuthService,
		DashboardService,
		SalesService,
		PurchaseService,
		OrderService,
		NotificationService,
		DistributorSaleService,
		DistributorPurchaseOrderService,
		LayoutConfigService,
		LayoutRefService,
		MenuConfigService,
		PageConfigService,
		KtDialogService,
		DataTableService,
		SplashScreenService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: GestureConfig
		},
		{
			// layout config initializer
			provide: APP_INITIALIZER,
			useFactory: initializeLayoutConfig,
			deps: [LayoutConfigService], multi: true
		},
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: {languages: hljsLanguages}
		},
		// template services
		SubheaderService,
		MenuHorizontalService,
		MenuAsideService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
