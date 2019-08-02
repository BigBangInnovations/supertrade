import { Product } from '../../product/_models/product.model';

// export class DistributorSaleTEST {
//     id: number;

//     date: string;
//     scheme_id: string;
//     loyalty_id: number;
//     retailer_id: number;
//     GrossAmount: number;
//     //Customr Detail
//     name: string;
//     mobile_no: string;
//     landline_no: string;
//     country: string;
//     state: string;
//     city: string;
//     address_line1: string;
//     address_line2: string;
//     pincode: string;
//     products_json: string

//     clear(): void {
//         this.id = undefined;
//         this.date = '';
//         this.scheme_id = '';
//         this.loyalty_id = undefined;
//         this.retailer_id = undefined;
//         this.GrossAmount = undefined;;
//         this.name = '';
//         this.mobile_no = '';
//         this.landline_no = '';
//         this.country = '';
//         this.state = '';
//         this.city = '';
//         this.address_line1 = '';
//         this.address_line2 = '';
//         this.pincode = '';
//         // this.NetAmount = undefined;;
//         this.products_json = '';
//     }
// }

export class DistributorSale {
    id = undefined;
    sl_distributorSale_id: number; //retrurn time distributorSale id
    sl_distributor_sales_id: number; //Distributor sales id against this distributorSale order
    scheme_id = '';
    loyalty_id = undefined;
    retailer_id = undefined;
    retailer_name = '';
    Distributor_Name = '';
    distributor_id = undefined;
    soID = undefined;
    godownID = undefined;
    isShippingAddressSameAsDispatch = undefined;
    Address_Master_ID = undefined;
    AddressLine1 = '';
    AddressLine2 = '';
    City = '';
    State = '';
    Country = '';
    Pincode = '';
    paymentMode = undefined;
    bankName = '';
    cheqNo = '';
    cheqDate = '';
    frightTerm = undefined;
    dcNo = '';
    grNo = '';
    transporter = '';
    deliveryDays = '';
    remarks = '';
    erpInvoiceNo = '';
    date = '';
    products_json: string
    Tax_Type: string
    data: string

    clear(): void {
        this.id = undefined;
        this.sl_distributorSale_id = undefined;
        this.sl_distributor_sales_id = undefined;
        this.scheme_id = '';
        this.loyalty_id = undefined;
        this.retailer_id = undefined;
        this.retailer_name = '';
        this.Distributor_Name = '';
        this.distributor_id = undefined;
        this.soID = undefined;
        this.godownID = undefined;
        this.isShippingAddressSameAsDispatch = undefined;
        this.Address_Master_ID = undefined;
        this.AddressLine1 = '';
        this.AddressLine2 = '';
        this.City = '';
        this.State = '';
        this.Country = '';
        this.Pincode = '';
        this.paymentMode = undefined;
        this.bankName = '';
        this.cheqNo = '';
        this.cheqDate = '';
        this.frightTerm = undefined;
        this.dcNo = '';
        this.grNo = '';
        this.transporter = '';
        this.deliveryDays = '';
        this.remarks = '';
        this.erpInvoiceNo = '';
        this.date = '';
        this.products_json = '';
        this.Tax_Type = '';
        this.data = '';
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