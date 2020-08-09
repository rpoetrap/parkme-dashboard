import { NextPage } from 'next';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';
import { FaEdit, FaTrashAlt, FaUserTie } from 'react-icons/fa';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';

import Authenticated from '../../../layouts/Authenticated'
import { Card, CardBody } from '../../../components/Card';
import styles from '../../styles.module.scss';
import userResource from '../../../resources/user';
import GenericError from '../../../components/GenericError';
import { GlobalProps } from '../../../types';

interface Props extends GlobalProps {

}

const SingleUserPage: NextPage<Props> = (props: Props) => {
	const { } = props;

	const router = useRouter();
	const { id } = router.query;
	const resourcePath = router.pathname.split('/').slice(0, -1).join('/');

	const [resourceData, setResourceData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			const result = await userResource.getSingle(id as string);
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data } = result;
			setResourceData(data);
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch user',
				text: err.code === 404 ? 'Not Found' : undefined,
				icon: 'error'
			}).then(() => router.push(resourcePath));
		}
	}

	const deleteData = async () => {
		try {
			const result = await userResource.deleteData(id as string);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			Swal.fire({
				title: 'Success',
				text: 'User berhasil dihapus',
				icon: 'success'
			}).then(() => router.push(resourcePath));
		} catch {
			Swal.fire({
				title: 'Error to delete user',
				text: 'Gagal menghapus user',
				icon: 'error'
			});
		}
	}

	const onDelete = () => {
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
		<Authenticated config={props.config} title="Palang Parkir" loading={loading}>
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
							<div className="d-flex align-items-start">
								<div className="col-2" style={{ backgroundColor: '#e9ecef' }}>
									<ReactSVG className="py-4 text-primary" src="/assets/img/avatar.svg" beforeInjection={(svg) => {
										svg.setAttribute('fill', 'currentColor')
									}} />
								</div>
								<div className="d-flex flex-column col">
									<div className={cx(styles['form-group'], styles['row'])}>
										<label className={styles['col-sm-3']}>ID</label>:
										<div className={styles['col']}>{resourceData?.user_identifier}</div>
									</div>
									<div className={cx(styles['form-group'], styles['row'])}>
										<label className={styles['col-sm-3']}>Nama</label>:
										<div className={styles['col']}>
											{resourceData?.name}
											{resourceData?.is_admin ?
												<span className={cx(styles['badge'], styles['badge-info'], styles['ml-1'])}><FaUserTie /></span> :
												undefined
											}
										</div>
									</div>
									<div className={cx(styles['form-group'], styles['row'])}>
										<label className={styles['col-sm-3']}>Nomor Telepon</label>:
										<div className={styles['col']}>{resourceData?.phone}</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</Authenticated>
	)
}

export default SingleUserPage;