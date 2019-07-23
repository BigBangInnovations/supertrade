export class Notification {
    ID: number;
    User_ID: number;
    User_Type: string;
    Message: string;
    Type: number;
    Transaction_ID: string;
    Status: number;
    Is_Shelf: number;
    Last_Modified: string;

    clear(): void {
        this.ID = 0;
        this.User_ID = 0;
        this.User_Type = '';
        this.Message = '';
        this.Type = 0;
        this.Transaction_ID = '';
        this.Status = 0;
        this.Is_Shelf = 0;
        this.Last_Modified = '';
	}
}