export interface Pagination {
	currentItemCount: number,
	itemsPerPage: number;
	totalItems: number,
	pageIndex: number;
	totalPages: number,
	sorts: string;
	filters?: string;
	search?: string;
}