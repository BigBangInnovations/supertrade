import { Product } from '../../product/_models/product.model';

export class DistributorPurchaseOrder {
    id: number;
    date: string;
    vendor_Name: string;
    ss_vendor_id: number;
    ss_distributor_id: number;
    GrossAmount: number;
    //Customr Detail
    products_json: string
    addsalesorderjson: string
    Tax_Type: string
    remarks: string   

    clear(): void {
        this.id = undefined;
        this.date = '';
        this.vendor_Name = '';
        this.ss_vendor_id = undefined;
        this.ss_distributor_id = undefined;
        this.GrossAmount = undefined;
        this.products_json = '';
        this.addsalesorderjson = '';
        this.Tax_Type = '';
        this.remarks = '';
	}
}
