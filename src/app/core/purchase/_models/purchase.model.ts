import { Product } from '../../product/_models/product.model';

export class Purchase {
    id: number;
    sl_purchase_id: number; //retrurn time purchase id
    sl_distributor_sales_id:number; //Distributor sales id against this purchase order
    // invoice_id: string;
    // transaction_id: string;
    date: string;
    data: string;
    retailer_name: string;
    Distributor_Name: string;
    // sl_user_id: number;
    // company_id: number;
    // is_active: boolean;
    scheme_id: string;
    loyalty_id: number;
    distributor_id: number;
    retailer_id: number;
    GrossAmount: number;
    //Customr Detail
    name: string;
    mobile_no: string;
    landline_no: string;
    country: string;
    state: string;
    city: string;
    address_line1: string;
    address_line2: string;
    pincode: string;
    // NetAmount: number;
    // product: Product[];
    products_json: string

    clear(): void {
        this.id = undefined;
        this.sl_purchase_id = undefined;
        this.sl_distributor_sales_id = undefined;
        // this.invoice_id = '';
        // this.transaction_id = '';
        this.date = '';
        this.data = '';
        this.retailer_name = '';
        this.Distributor_Name = '';
        // this.sl_user_id = undefined;;
        // this.company_id = undefined;;
        // this.is_active = false;
        this.scheme_id = '';
        this.loyalty_id = undefined;
        this.distributor_id = undefined;
        this.retailer_id = undefined;
        this.GrossAmount = undefined;;
        this.name = '';
        this.mobile_no = '';
        this.landline_no = '';
        this.country = '';
        this.state = '';
        this.city = '';
        this.address_line1 = '';
        this.address_line2 = '';
        this.pincode = '';
        // this.NetAmount = undefined;;
        this.products_json = '';
	}
}

export class UserPointsStatus {
    accumulated_points: number;
    loyalty_id: number;
    scheme_id: string;

    clear(): void {
        this.accumulated_points = undefined;
        this.loyalty_id = undefined;
        this.scheme_id = '';
    }
}