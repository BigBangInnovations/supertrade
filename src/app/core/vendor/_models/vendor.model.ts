export class Vendor {
    ID: number;
    Name: string;
    Mobile_No:string;

    clear(): void {
        this.ID = undefined;
        this.Name = '';
        this.Mobile_No = '';
	}
}