import { useState, useEffect } from 'react'
import { IDataTableColumn } from 'react-data-table-component';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';
import cx from 'classnames';
import { FaUserTie } from 'react-icons/fa';

import Authenticated from '../../layouts/Authenticated'
import { Card, CardBody } from '../../components/Card';
import GenericTable from '../../components/GenericTable';
import styles from '../styles.module.scss';
import userResource from '../../resources/user';
import { Pagination, GlobalProps } from '../../types';
import { NextPage } from 'next';

interface Props extends GlobalProps {

}

const UsersPage: NextPage<Props> = (props: Props) => {
	const { config: { user } } = props;
	
	const router = useRouter();

	const [resourceData, setResourceData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '-created_at', filters: `id!=${user.id}` });
	
	const tableColumns: IDataTableColumn[] = [
		{
			name: 'ID',
			selector: 'user_identifier',
			grow: 2,
			format: data => data.user_identifier || '-',
			sortable: true
		},
		{
			name: 'Nama',
			selector: 'name',
			grow: 2,
			cell: data => (
				<div className={styles['d-flex']}>
					{data.name}{data.is_admin ?
						<span className={cx(styles['badge'], styles['badge-info'], styles['ml-1'])}><FaUserTie /></span> :
						undefined}
				</div>),
			sortable: true
		},
		{
			name: 'Nomor Telepon',
			selector: 'phone',
			grow: 2,
			format: data => data.phone || '-',
			sortable: true
		},
	];

	const fetchData = async () => {
		try {
			const result = await userResource.getList(pagination);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			const { data: resultPagination } = result;
			setResourceData(resultPagination.items);
			delete resultPagination['items'];
			delete resultPagination['kind'];
			setPagination(resultPagination);
		} catch {
			Swal.fire({
				title: 'Error to fetch users',
				icon: 'error'
			});
		}
	}

	const deleteData = async (id: number | string) => {
		try {
			const result = await userResource.deleteData(id);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			Swal.fire({
				title: 'Success',
				text: 'User berhasil dihapus',
				icon: 'success',
				onRender: () => fetchData()
			});
		} catch {
			Swal.fire({
				title: 'Error to delete users',
				text: 'Gagal menghapus user',
				icon: 'error'
			});
		}
	}

	const onDelete = (data: any) => {
		Swal.fire({
			title: 'Apakah anda yakin?',
			text: 'Ingin menghapus user ini?',
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
		setLoading(true);
		fetchData().then(() => setLoading(false));
	}, [pagination.pageIndex, pagination.itemsPerPage, pagination.sorts]);

  return (
    <Authenticated config={props.config} title="Users" loading={loading}>
      <div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Daftar User</h5>
								<Link href={router.pathname + '/add'}>
									<a className={cx(styles['btn'], styles['btn-primary'])}>+ Tambah User</a>
								</Link>
							</div>
							<GenericTable
								id="tableKendaraan"
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

export default UsersPage;