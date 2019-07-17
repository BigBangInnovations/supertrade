import { Purchase, UserPointsStatus } from '../purchase/_models/purchase.model';
import { Sale } from '../sales/_models/sale.model';

export class CommonResponse {
    error: string;
    message: string;
    status: string;
    data:[{
        purchase:Purchase[],
        sales:Sale[],
        userPointsStatus:UserPointsStatus
    }]
    | [];

    clear(): void {
        this.error = '';
        this.message = '';
        this.status = '';
        this.data = [];
    }
}

export class Product {
    CGSTSurcharges: number;
    CGSTTax: number;
    Discount: number;
    IGSTSurcharges: number;
    IGSTTax: number;
    InclusiveExclusive: number;
    Name: string;
    Price: number;
    ProductAmount: number;
    ProductID: number;
    Quantity: number;
    ReturnQuantity: number;
    SGSTSurcharges: number;
    SGSTTax: number;
    VATFrom: string;
    VATPercentage: number;
    points: number;
    points_boost: number;

    clear(): void {
        this.CGSTSurcharges = undefined;
        this.CGSTTax = undefined;
        this.Discount = undefined;
        this.IGSTSurcharges = undefined;
        this.IGSTTax = undefined;
        this.InclusiveExclusive = undefined;
        this.Name = '';
        this.Price = undefined;
        this.ProductAmount = undefined;
        this.ProductID = undefined;
        this.Quantity = undefined;
        this.ReturnQuantity = undefined;
        this.SGSTSurcharges = undefined;
        this.SGSTTax = undefined;
        this.VATFrom = '';
        this.VATPercentage = undefined;
        this.points = undefined;
        this.points_boost = undefined;
    }
}


