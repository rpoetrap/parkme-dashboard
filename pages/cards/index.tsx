import { useState, useEffect } from 'react'
import { NextPage } from 'next';
import { IDataTableColumn } from 'react-data-table-component';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';
import cx from 'classnames';

import Authenticated from '../../layouts/Authenticated'
import { Card, CardBody } from '../../components/Card';
import GenericTable from '../../components/GenericTable';
import styles from '../styles.module.scss';
import cardResource from '../../resources/card';
import { Pagination, GlobalProps } from '../../types';
import { switchType } from '../../utils/string';

interface Props extends GlobalProps {

}

const CardsPage: NextPage<Props> = (props: Props) => {
	const { } = props;
	const router = useRouter();

	const [resourceData, setResourceData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '' });
	
	const tableColumns: IDataTableColumn[] = [
		{
			name: 'Kode Kartu',
			selector: 'serial',
			grow: 2,
			sortable: true
		},
		{
			name: 'Pemilik Kartu',
			selector: 'user.name',
			format: data => data?.user?.name || '-',
			grow: 2,
			sortable: true
		},
		{
			name: 'Hak Akses',
			selector: 'role.name',
			grow: 2,
			sortable: true
		},
		{
			name: 'Aktif',
			selector: 'is_blocked',
			center: true,
			cell: data => switchType(!data.is_blocked),
			sortable: true
		},
	];

	const fetchData = async () => {
		try {
			setLoading(true);
			const result = await cardResource.getList(pagination);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			const { data: resultPagination } = result;
			setResourceData(resultPagination.items);
			delete resultPagination['items'];
			delete resultPagination['kind'];
			setPagination(resultPagination);
		} catch {
			Swal.fire({
				title: 'Error to fetch cards',
				icon: 'error'
			});
		} finally {
			setLoading(false);
		}
	}

	const deleteData = async (id: number | string) => {
		try {
			const result = await cardResource.deleteData(id);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			Swal.fire({
				title: 'Success',
				text: 'Kartu berhasil dihapus',
				icon: 'success',
				onRender: () => fetchData()
			});
		} catch {
			Swal.fire({
				title: 'Error to delete cards',
				text: 'Gagal menghapus kartu',
				icon: 'error'
			});
		}
	}

	const onDelete = (data: any) => {
		Swal.fire({
			title: 'Apakah anda yakin?',
			text: 'Ingin menghapus kartu ini?',
			icon: 'warning',
			showCancelButton: true,
			reverseButtons: true,
			confirmButtonText: 'Hapus',
			cancelButtonText: 'Batal',
			buttonsStyling: false,
			customClass: {
				confirmButton: 'btn btn-danger btn-lg mx-2',
				cancelButton: 'btn btn-light btn-lg mx-2'
			}
		}).then(result => {
			if (result.isConfirmed) {
				deleteData(data.id);
			}
		});
	}
	
	useEffect(() => {
		fetchData();
	}, [pagination.pageIndex, pagination.itemsPerPage, pagination.sorts]);

  return (
    <Authenticated config={props.config} title="Kartu" loading={loading}>
      <div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Daftar Kartu</h5>
								<Link href={router.pathname + '/add'}>
									<a className={cx(styles['btn'], styles['btn-primary'])}>+ Tambah Kartu</a>
								</Link>
							</div>
							<GenericTable
								id="tableKartu"
								columns={tableColumns}
								data={resourceData}
								routeName={router.pathname.split('/').pop()}
								getter={pagination}
								setter={setPagination}
								onDelete={onDelete}
							/>
						</CardBody>
					</Card>
				</div>
			</div>
    </Authenticated>
  )
}

export default CardsPage;