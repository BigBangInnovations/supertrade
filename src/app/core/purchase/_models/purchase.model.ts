import { Product } from '../../product/_models/product.model'

export class Purchase {
    GrossAmount: number;
    NetAmount: number;
    ProductCode: string;
    company_id: number;
    created_by: number;
    created_time: Date;
    date: Date;
    id: number;
    invoice_id: string;
    is_active: true
    last_modified: Date;
    last_modified_By: number;
    points: number;
    points_boost: number;
    price: number;
    product: [Product]
    product_id: number;
    qty: number;
    scheme_id: string;
    serial_no: string;
    sl_distributor_sales_id: number;
    sl_user_id: number;
    ss_distributor_id: number;
    transaction_id: string;

    clear(): void {
        this.id = undefined;
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