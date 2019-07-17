export class QueryResultsModel {
	// fields
	items: any[];
	totalCount: number;
	errorMessage: string;
	userPoints: [];

	constructor(_items: any[] = [], _totalCount: number = 0, _errorMessage: string = '', _userPoints:[]= []) {
		this.items = _items;
		this.totalCount = _totalCount;
		this.userPoints = _userPoints;
	}
}
