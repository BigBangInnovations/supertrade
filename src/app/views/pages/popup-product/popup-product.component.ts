// Angular
import { ChangeDetectorRef, Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap, filter } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { Product } from '../../../core/product/_models/product.model'
import { ProductService } from '../../../core/product/_services'
import { HttpParams } from "@angular/common/http";
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { CommonResponse } from '../../../core/common/common.model'

import * as fromProduct from '../../../core/product'
import { async } from '@angular/core/testing';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
// import { filter } from 'minimatch';

@Component({
  selector: 'kt-popup-product',
  templateUrl: './popup-product.component.html',
  // changeDetection: ChangeDetectionStrategy.Default,
})
export class PopupProductComponent implements OnInit {
  productFormArray: any;
  popupProductForm: FormGroup;
  // viewLoading: boolean = false;
  categoryLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  errors: any = [];
  isProductloaded$: Observable<boolean>;
  viewLoading$: Observable<boolean>;
  categories$: Observable<Product[]>;
  subCategoryArray;
  productArray;

  private unsubscribe: Subject<any>;
  /**
	 * Component constructor
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
   * @param layoutUtilsService: LayoutUtilsService
	 */
  constructor(
    public dialogRef: MatDialogRef<PopupProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ProductSer: ProductService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.initPopupProductForm();
    this.store.select(fromProduct.selectProductLoaded).pipe().subscribe(data => {
      if (data) {
        this.categories$ = this.store.pipe(select(fromProduct.selectAllProducts));
      } else {
        this.store.dispatch(new fromProduct.LoadProducts())
        this.categories$ = this.store.pipe(select(fromProduct.selectAllProducts));
      }
    });
    this.viewLoading$ = this.store.pipe(select(fromProduct.selectProductLoading));
  }
  /**
	 * Form initalization
	 * Default params, validators
	 */
  initPopupProductForm() {
    const numberPatern = '^[0-9.,]+$';
    this.popupProductForm = this.fb.group({
      productCategoryCtrl: ['', Validators.required],
      productSubCategoryCtrl: ['', Validators.required],
      productCtrl: ['', Validators.required],
      productNameCtrl: [''],
      productPriceCtrl: [''],
      productTaxSGSTCtrl: [''],
      productTaxSGSTSurchargesCtrl: [''],
      productTaxCGSTCtrl: [''],
      productTaxCGSTSurchargesCtrl: [''],
      productTaxIGSTCtrl: [''],
      productTaxIGSTSurchargesCtrl: [''],
      productQuantityCtrl: ['', [
        Validators.required,
        Validators.pattern(numberPatern),
        Validators.minLength(1),
        Validators.maxLength(5)
      ]],
      productDiscountCtrl: [''],
      productLoyaltyPointCtrl: [''],
      productBarCodeCtrl: [''],
      productProductCodeCtrl: [''],
      VATPercentageCtrl: [''],
      InclusiveExclusiveCtrl: [''],
      VATFromCtrl: [''],
      VATCodeCtrl: [''],
    });
  }

  /**
   * Form Submit
   */
  onSubmit() {
    const controls = this.popupProductForm.controls;
    /** check form */
    if (this.popupProductForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    const numberPatern = '^[0-9.,]+$';
    this.productFormArray = {
      productCategoryCtrl: [this.popupProductForm.controls['productCategoryCtrl'].value],
      productSubCategoryCtrl: [this.popupProductForm.controls['productSubCategoryCtrl'].value],
      productCtrl: [this.popupProductForm.controls['productCtrl'].value],
      productNameCtrl: [this.popupProductForm.controls['productNameCtrl'].value],
      productPriceCtrl: [this.popupProductForm.controls['productPriceCtrl'].value],
      productTaxSGSTCtrl: [this.popupProductForm.controls['productTaxSGSTCtrl'].value],
      productTaxSGSTSurchargesCtrl: [this.popupProductForm.controls['productTaxSGSTSurchargesCtrl'].value],
      productTaxCGSTCtrl: [this.popupProductForm.controls['productTaxCGSTCtrl'].value],
      productTaxCGSTSurchargesCtrl: [this.popupProductForm.controls['productTaxCGSTSurchargesCtrl'].value],
      productTaxIGSTCtrl: [this.popupProductForm.controls['productTaxIGSTCtrl'].value],
      productTaxIGSTSurchargesCtrl: [this.popupProductForm.controls['productTaxIGSTSurchargesCtrl'].value],
      productOriginalQuantityCtrl: [this.popupProductForm.controls['productQuantityCtrl'].value],
      productReturnedQuantityCtrl: [0],
      productQuantityCtrl: [this.popupProductForm.controls['productQuantityCtrl'].value,
      Validators.compose([
        Validators.required,
        Validators.pattern(numberPatern),
        Validators.minLength(1),
        Validators.maxLength(5)
      ])

      ],
      productDiscountCtrl: [this.popupProductForm.controls['productDiscountCtrl'].value],
      productLoyaltyPointCtrl: [this.popupProductForm.controls['productLoyaltyPointCtrl'].value],
      productBarCodeCtrl: [this.popupProductForm.controls['productBarCodeCtrl'].value],
      productProductCodeCtrl: [this.popupProductForm.controls['productProductCodeCtrl'].value],
      VATPercentageCtrl: [this.popupProductForm.controls['VATPercentageCtrl'].value],
      InclusiveExclusiveCtrl: [this.popupProductForm.controls['InclusiveExclusiveCtrl'].value],
      VATFromCtrl: [this.popupProductForm.controls['VATFromCtrl'].value],
      VATCodeCtrl: [this.popupProductForm.controls['VATCodeCtrl'].value],
    }

    this.dialogRef.close(this.productFormArray);
  }

  close() {
    this.dialogRef.close();
  }

  changeCategory(category) {
    this.subCategoryArray = [];
    this.productArray = [];
    let allCategory;
    this.categories$.subscribe((changes) => {
      allCategory = changes;
    })

    allCategory.filter((data: any) => {
      if (data.ID == category) {
        this.subCategoryArray = data.subcategories
      }

    });
  }

  changeSubCategory(subCategory) {
    this.productArray = [];
    let allSubCategory = this.subCategoryArray;
    allSubCategory.filter((data: any) => {
      if (data.ID == subCategory) {
        this.productArray = data.products;
        this.popupProductForm.controls['productTaxSGSTCtrl'].setValue(data.SGSTTax);
        this.popupProductForm.controls['productTaxSGSTSurchargesCtrl'].setValue(data.SGSTSurcharges);
        this.popupProductForm.controls['productTaxCGSTCtrl'].setValue(data.CGSTTax);
        this.popupProductForm.controls['productTaxCGSTSurchargesCtrl'].setValue(data.CGSTSurcharges);
        this.popupProductForm.controls['productTaxIGSTCtrl'].setValue(data.IGSTTax);
        this.popupProductForm.controls['productTaxIGSTSurchargesCtrl'].setValue(data.IGSTSurcharges);
        this.popupProductForm.controls['VATCodeCtrl'].setValue(data.VAT_Code);
      }
    });
  }

  changeProduct(productID) {
    if (this.data.addedProductsIds.indexOf(productID) > -1) {
      this.popupProductForm.controls['productCtrl'].setValue('');
      const message = `Already product added`;
      this.layoutUtilsService.showActionNotification(message, MessageType.Read, 5000, false, false);
      return;
    }
    let allProducts = this.productArray;
    allProducts.filter((data: any) => {
      if (data.ID == productID) {
        if (this.data.isDiscount)
          this.popupProductForm.controls['productDiscountCtrl'].setValue(data.MaxDiscount);
        else
          this.popupProductForm.controls['productDiscountCtrl'].setValue(0);
        this.popupProductForm.controls['productLoyaltyPointCtrl'].setValue(data.loyalty_point);
        this.popupProductForm.controls['productPriceCtrl'].setValue(data.Price);
        this.popupProductForm.controls['productBarCodeCtrl'].setValue(data.BarCode);
        this.popupProductForm.controls['productNameCtrl'].setValue(data.Name);
        this.popupProductForm.controls['productProductCodeCtrl'].setValue(data.ProductCode);
      }
    });
  }
}