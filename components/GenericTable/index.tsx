import Link from 'next/link';
import { FunctionComponent, Dispatch, SetStateAction, ReactNode } from 'react';
import DataTable, { IDataTableStyles, IDataTableColumn } from 'react-data-table-component';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

import styles from '../../pages/styles.module.scss';
import { Pagination } from '../../types';

interface Props {
	id?: string;
	getter: Pagination;
	setter: Dispatch<SetStateAction<Pagination>>;
	columns: IDataTableColumn[];
	data: any[];
	routeName?: string;
	hideAction?: boolean;
	customAction?: (data: any) => ReactNode;
	hideRowNumber?: boolean;
	onDelete?: (data: any) => void;
}

let tableId = 1;

const GenericTable: FunctionComponent<Props> = (props: Props) => {
	const { id, getter, setter, data, routeName, customAction, onDelete } = props;
	let { hideRowNumber, hideAction, columns } = props;
	let cellId = 1;
	hideRowNumber = hideRowNumber ? hideRowNumber : false;
	hideAction = hideAction ? hideAction : false;

	let columnSorts = getter.sorts.split(';').map(item => {
		let column = item;
		let direction = 'asc';
		if (column.startsWith('-')) {
			column = column.slice(1);
			direction = 'desc';
		}
		return { column, direction };
	});

	columns = [...columns];
	if (!hideRowNumber) {
		columns.unshift({
			name: '#',
			selector: 'id',
			sortable: true,
			format: (_, index) => (getter.pageIndex - 1) * getter.itemsPerPage + (index + 1)
		});
	}

	if (!hideAction && routeName) {
		columns.push({
			name: 'Action',
			sortable: false,
			center: true,
			minWidth: '8rem',
			cell: data => customAction !== undefined ? customAction(data) : (
				<div>
					<Link href={`/${routeName}/${data.id}`}>
						<span className="btn btn-sm btn-outline-primary border-0"><FaRegEye /></span>
					</Link>
					<Link href={`/${routeName}/${data.id}/edit`}>
						<span className="btn btn-sm btn-outline-primary border-0"><FaEdit /></span>
					</Link>
					{onDelete ? (
						<span className="btn btn-sm btn-outline-danger border-0" onClick={() => onDelete(data)}><FaTrashAlt /></span>
					) : null}
				</div>
			)
		});
	}

	columns = columns.map(item => ({
		...item,
		id: id ? `${id}-cell${cellId++}` : `table${tableId++}-cell${cellId++}`
	}));

	const tableStyle: IDataTableStyles = {
		headCells: {
			style: {
				fontSize: 'inherit',
				fontWeight: 'bold'
			}
		},
		rows: {
			style: {
				font: 'inherit'
			}
		}
	}

	const onChangePage = (pageIndex: number) => {
		setter(getter => ({ ...getter, pageIndex }));
	}

	const onChangeRowsPerPage = (itemsPerPage: number, pageIndex: number) => {
		setter(getter => ({ ...getter, itemsPerPage, pageIndex }));
	}

	const onSort = (column: IDataTableColumn, direction: 'desc' | 'asc') => {
		if (column.selector) {
			columnSorts = [{ column: column.selector.toString(), direction }];
			setter(getter => ({
				...getter,
				sorts: columnSorts.map(item => item.direction === 'asc' ? item.column : `-${item.column}`).join(';')
			}));
		}
	}

	return (
		<DataTable
			columns={columns}
			data={data}
			noHeader={true}
			noDataComponent={<div className={styles['p-4']}>Tidak ada data</div>}
			customStyles={tableStyle}
			striped={true}
			pagination={true}
			paginationServer={true}
			paginationTotalRows={getter.totalItems}
			paginationPerPage={getter.itemsPerPage}
			onChangePage={onChangePage}
			onChangeRowsPerPage={onChangeRowsPerPage}
			sortServer={true}
			onSort={onSort}
		/>
	)
}

export default GenericTable;