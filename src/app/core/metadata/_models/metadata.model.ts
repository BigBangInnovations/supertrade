export class FrightTerm {
    ID: number;
    Description: string;

    clear(): void {
        this.ID = undefined;
        this.Description = '';
    }
}

export class Godown {
    ID: number;
    name: string;

    clear(): void {
        this.ID = undefined;
        this.name = '';
    }
}

export class PaymentMode {
    ID: number;
    Description: string;

    clear(): void {
        this.ID = undefined;
        this.Description = '';
    }
}