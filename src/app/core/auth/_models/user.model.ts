import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

export class SalesScheme {
    scheme_id:string;
}
export class PurchaseScheme {
    scheme_id:string;
}

export class User extends BaseModel {
    id: number;
    Company_Type_ID: number;
    username: string;
    password: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    roles: number[];
    pic: string;
    fullname: string;
    occupation: string;
	companyName: string;
	phone: string;
    address: Address;
    socialNetworks: SocialNetworks;
    salesActiveScheme:SalesScheme;
    purchaseActiveScheme:PurchaseScheme;

    clear(): void {
        this.id = undefined;
        this.Company_Type_ID = undefined;
        this.username = '';
        this.password = '';
        this.email = '';
        this.roles = [];
        this.fullname = '';
        this.accessToken = 'access-token-' + Math.random();
        this.refreshToken = 'access-token-' + Math.random();
        this.pic = './assets/media/users/default.jpg';
        this.occupation = '';
        this.companyName = '';
        this.phone = '';
        this.address = new Address();
        this.address.clear();
        this.socialNetworks = new SocialNetworks();
        this.socialNetworks.clear();
    }
}
