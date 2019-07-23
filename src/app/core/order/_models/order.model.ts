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