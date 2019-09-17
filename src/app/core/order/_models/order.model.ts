import { Product } from '../../product/_models/product.model';

export class Order {
    SOMadeBy: string;
    SOMadeFrom: string;
    ApprovedBy: number;
    AssignedTo: number;
    CompanyID: number;
    CreatedBy: number;
    CustomerID: number;
    CustomerName: string;
    DealerCity: string;
    DealerCode: string;
    DeliveryDays: number;
    Description: string;
    EditStatusID: number;
    FlatPromotionPercentage: number;
    FulfilledByID: number;
    GrossAmount: number;
    ID: number;
    LocalTaxID: number;
    LocalTaxSurcharge: number;
    LocalTaxValue: number;
    NetAmount: number;
    IsPromotionApplied: number;
    PromotionID: number;
    SeriesPostfix: number;
    SeriesPrefix: string;
    StatusID: number;
    TNC: string;
    Warranty: string;

    clear(): void {
        this.SOMadeBy = '';
        this.SOMadeFrom = 'SuperTrade';
        this.ApprovedBy = 0;
        this.AssignedTo = 0;
        this.CompanyID = 0;
        this.CreatedBy = 0;
        this.CustomerID = 0;
        this.CustomerName = '';
        this.DealerCity = '';
        this.DealerCode = '';
        this.DeliveryDays = 0;
        this.Description = '';
        this.EditStatusID = 0;
        this.FlatPromotionPercentage = 0;
        this.FulfilledByID = 0;
        this.GrossAmount = 0;
        this.ID = 0;
        this.LocalTaxID = 0;
        this.LocalTaxSurcharge = 0;
        this.LocalTaxValue = 0;
        this.NetAmount = 0;
        this.IsPromotionApplied = 0;
        this.PromotionID = 0;
        this.SeriesPostfix = 0;
        this.SeriesPrefix = 'ST';
        this.StatusID = 1;
        this.TNC = '';
        this.Warranty = '';
    }
}

export class AddEditOrder {
    CompanyID: number;
    UserID: number;
    TokenID: string;
    addsalesorderjson: string;
    addsalesorderproductjson: string;
    Application: string;

    clear(): void {
        this.CompanyID = 0;
        this.UserID = 0;
        this.TokenID = '';
        this.addsalesorderjson = '';
        this.addsalesorderproductjson = '';
        this.Application = 'SuperLoyal';//Hardcoded from bacckend Please don't chnage this
    }
}

export class orderProduct {
    CGSTSurcharges = undefined;
    CGSTTax = undefined;
    CST = undefined;
    CSTSurcharge = undefined;
    CategoryType = undefined;
    CustomerClass = undefined;
    Discount = undefined;
    DistributorMaxDiscount = undefined;
    DiscountA = undefined;
    DiscountB = undefined;
    DiscountC = undefined;
    DiscountType = undefined;
    DispatchQuantity = undefined;
    ExciseDuty = undefined;
    ExciseSurcharge = undefined;
    FOCQuantity = undefined;
    GSTEnabled = undefined;
    IGSTSurcharges = undefined;
    IGSTTax = undefined;
    InclusiveExclusive: '';
    IsPromotional = undefined;
    Maxdiscount = undefined;
    Name: '';
    Price = undefined;
    ProductAmount = undefined;
    ProductCatId = undefined;
    ProductID = undefined;
    ProductSubCatId = undefined;
    Quantity = undefined;
    SGSTSurcharges = undefined;
    SGSTTax = undefined;
    SalesOrderID = undefined;
    ServiceTax = undefined;
    ServiceTaxSurcharge = undefined;
    VAT = undefined;
    VATAdditionalTax = undefined;
    VATFrom: '';
    VATPercentage = undefined;
    VATSurcharge = undefined;
    LoyaltyPoint = undefined;
    points = undefined;

    clear(): void {
        this.CGSTSurcharges = undefined;
        this.CGSTTax = undefined;
        this.CST = undefined;
        this.CSTSurcharge = undefined;
        this.CategoryType = undefined;
        this.CustomerClass = undefined;
        this.Discount = undefined;
        this.DistributorMaxDiscount = undefined;
        this.DiscountA = undefined;
        this.DiscountB = undefined;
        this.DiscountC = undefined;
        this.DiscountType = undefined;
        this.DispatchQuantity = undefined;
        this.ExciseDuty = undefined;
        this.ExciseSurcharge = undefined;
        this.FOCQuantity = undefined;
        this.GSTEnabled = undefined;
        this.IGSTSurcharges = undefined;
        this.IGSTTax = undefined;
        this.InclusiveExclusive = '';
        this.IsPromotional = undefined;
        this.Maxdiscount = undefined;
        this.Name = '';
        this.Price = undefined;
        this.ProductAmount = undefined;
        this.ProductCatId = undefined;
        this.ProductID = undefined;
        this.ProductSubCatId = undefined;
        this.Quantity = undefined;
        this.SGSTSurcharges = undefined;
        this.SGSTTax = undefined;
        this.SalesOrderID = undefined;
        this.ServiceTax = undefined;
        this.ServiceTaxSurcharge = undefined;
        this.VAT = undefined;
        this.VATAdditionalTax = undefined;
        this.VATFrom = '';
        this.VATPercentage = undefined;
        this.VATSurcharge = undefined;
        this.LoyaltyPoint = 0;
        this.points = 0;
    }
}