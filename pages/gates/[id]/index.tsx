import { NextPage } from 'next';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';

import Authenticated from '../../../layouts/Authenticated'
import { Card, CardBody } from '../../../components/Card';
import styles from '../../styles.module.scss';
import gateResource from '../../../resources/gate';
import { gateType } from '../../../utils/string';
import GenericError from '../../../components/GenericError';

interface Props {

}

const SingleGatePage: NextPage<Props> = (props: Props) => {
	const { } = props;
	
	const router = useRouter();
	const { id } = router.query;
	const resourcePath = router.pathname.split('/').slice(0, -1).join('/');

	const [resourceData, setResourceData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const fetchData = async () => {
		try {
			const result = await gateResource.getSingle(id as string);
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data } = result;
			setResourceData(data);
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch gate',
				text: err.code === 404 ? 'Not Found' : undefined,
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

	if (!loading && !resourceData) return <GenericError />
	return (
		<Authenticated title="Palang Parkir" loading={loading}>
			<div className={styles.row}>
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
		</Authenticated>
	)
}

export default SingleGatePage;