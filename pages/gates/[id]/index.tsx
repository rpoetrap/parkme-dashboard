import { NextPage } from 'next';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';
import moment from 'moment';
import { IDataTableColumn } from 'react-data-table-component';

import Authenticated from '../../../layouts/Authenticated'
import { Card, CardBody } from '../../../components/Card';
import styles from '../../styles.module.scss';
import gateResource from '../../../resources/gate';
import { gateType } from '../../../utils/string';
import GenericError from '../../../components/GenericError';
import { GlobalProps, Pagination, InputState } from '../../../types';
import historyResource from '../../../resources/history';
import GenericTable from '../../../components/GenericTable';
import FormInput from '../../../components/FormInput';

interface Props extends GlobalProps {

}

const SingleGatePage: NextPage<Props> = (props: Props) => {
	const { } = props;

	const router = useRouter();
	const { id } = router.query;
	const resourcePath = router.pathname.split('/').slice(0, -1).join('/');

	const [resourceData, setResourceData] = useState<any>(null);
	const [historyData, setHistoryData] = useState<any[]>([]);
	const [search, setSearch] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [pagination, setPagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '-created_at', filters: `gate.id==${id}`, search: '' });
	const [loading, setLoading] = useState(true);

	const tableColumns: IDataTableColumn[] = [
		{
			name: 'TNKB',
			selector: 'vehicle.plate',
			sortable: true
		},
		{
			name: 'Kode Kartu',
			selector: 'smartcard.serial',
			sortable: true
		},
		{
			name: 'Pemilik Kartu',
			selector: 'smartcard.user.name',
			format: data => data?.smartcard?.user?.name || '-',
			grow: 3,
			sortable: true
		},
		{
			name: 'Waktu',
			selector: 'created_at',
			grow: 2,
			format: data => moment(data.created_at).format('DD MMMM YYYY HH:mm'),
			sortable: true
		}
	];

	const fetchData = async () => {
		try {
			const result = await gateResource.getSingle(id as string);
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data } = result;
			setResourceData(data);
			fetchHistories();
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch gate',
				text: err.code === 404 ? 'Not Found' : undefined,
				icon: 'error'
			}).then(() => router.push(resourcePath));
		}
	}

	const fetchHistories = async () => {
		try {
			const result = await historyResource.getList({ ...pagination, search: search.value });
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data: resultPagination } = result;
			setHistoryData(resultPagination.items);
			delete resultPagination['items'];
			delete resultPagination['kind'];
			setPagination(resultPagination);
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch histories',
				text: err.message,
				icon: 'error'
			}).then(() => router.push(resourcePath));
		}
	}

	const deleteData = async () => {
		try {
			const result = await gateResource.deleteData(id as string);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			Swal.fire({
				title: 'Success',
				text: 'Palang parkir berhasil dihapus',
				icon: 'success'
			}).then(() => router.push(resourcePath));
		} catch {
			Swal.fire({
				title: 'Error to delete gates',
				text: 'Gagal menghapus palang parkir',
				icon: 'error'
			});
		}
	}

	const onDelete = () => {
		Swal.fire({
			title: 'Apakah anda yakin?',
			text: 'Ingin menghapus palang parkir ini?',
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
				deleteData();
			}
		});
	}

	useEffect(() => {
		setLoading(true);
		if (!id) return;
		fetchData().then(() => setLoading(false));
	}, [id]);

	useEffect(() => {
		fetchHistories();
	}, [pagination.pageIndex, pagination.itemsPerPage, pagination.sorts, search]);

	if (!loading && !resourceData) return <GenericError />
	return (
		<Authenticated config={props.config} title="Palang Parkir" loading={loading}>
			<div className={styles.row} style={{ marginBottom: '1.875rem' }}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>{resourceData?.name}</h5>
								<Link href={`${router.asPath}/edit`}>
									<a className={cx(styles['btn'], styles['btn-sm'], styles['btn-primary'], styles['mr-2'])}><FaEdit /></a>
								</Link>
								<button type="button" className={cx(styles['btn'], styles['btn-sm'], styles['btn-danger'])} onClick={onDelete}><FaTrashAlt /></button>
							</div>
							<div className={cx(styles['form-group'], styles['row'])}>
								<label className={styles['col-sm-2']}>Nama</label>:
								<div className={styles['col']}>{resourceData?.name}</div>
							</div>
							<div className={cx(styles['form-group'], styles['row'])}>
								<label className={styles['col-sm-2']}>Jenis</label>:
								<div className={styles['col']}>{gateType(resourceData?.type)}</div>
							</div>
							<div className={cx(styles['form-group'], styles['row'])}>
								<label className={styles['col-sm-2']}>Deskripsi</label>:
								<div className={styles['col']}>{resourceData?.description}</div>
							</div>
							{resourceData?.code ? (
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={styles['col-sm-2']}>Kode</label>:
									<div className={styles['col']}>{resourceData?.code}</div>
								</div>
							) : (
									<div className={cx(styles['form-group'], styles['row'])}>
										<label className={styles['col-sm-2']}>Session ID</label>:
										<div className={styles['col']}>{resourceData?.session_id}</div>
									</div>
								)}
						</CardBody>
					</Card>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Daftar Riwayat Parkir</h5>
								<div>
									<FormInput type="text" getter={search} setter={setSearch} placeholder="Cari TNKB" />
								</div>
							</div>
							<GenericTable
								id="tableKendaraan"
								columns={tableColumns}
								data={historyData}
								getter={pagination}
								setter={setPagination}
								hideAction={true}
							/>
						</CardBody>
					</Card>
				</div>
			</div>
		</Authenticated>
	)
}

export default SingleGatePage;