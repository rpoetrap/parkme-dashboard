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
import cardAccessResource from '../../../resources/cardAccess';
import GenericError from '../../../components/GenericError';
import { GlobalProps } from '../../../types';
import { switchType } from '../../../utils/string';

interface Props extends GlobalProps {

}

const SingleCardAccessPage: NextPage<Props> = (props: Props) => {
	const { } = props;
	
	const router = useRouter();
	const { id } = router.query;
	const resourcePath = router.pathname.split('/').slice(0, -1).join('/');

	const [resourceData, setResourceData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			const result = await cardAccessResource.getSingle(id as string);
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data } = result;
			setResourceData(data);
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch card access',
				text: err.code === 404 ? 'Not Found' : undefined,
				icon: 'error'
			}).then(() => router.push(resourcePath));
		}
	}

	const deleteData = async () => {
		try {
			const result = await cardAccessResource.deleteData(id as string);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			Swal.fire({
				title: 'Success',
				text: 'Hak akses berhasil dihapus',
				icon: 'success'
			}).then(() => router.push(resourcePath));
		} catch {
			Swal.fire({
				title: 'Error to delete card access',
				text: 'Gagal menghapus hak akses',
				icon: 'error'
			});
		}
	}

	const onDelete = () => {
		Swal.fire({
			title: 'Apakah anda yakin?',
			text: 'Ingin menghapus hak akses ini?',
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
		<Authenticated config={props.config} title="Hak Akses" loading={loading}>
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
								<label className={styles['col-sm-2']}>Deskripsi</label>:
								<div className={styles['col']}>{resourceData?.description}</div>
							</div>
							<div className={cx(styles['form-group'], styles['row'])}>
								<label className={styles['col-sm-2']}>Tanpa Biaya</label>:
								<div className={styles['col']}>{switchType(resourceData?.free_charge)}</div>
							</div>
							<div className={cx(styles['form-group'], styles['row'])}>
								<label className={styles['col-sm-2']}>Bebas Kendaraan</label>:
								<div className={styles['col']}>{switchType(resourceData?.free_vehicle)}</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</Authenticated>
	)
}

export default SingleCardAccessPage;