import { useState, useEffect, FormEvent } from 'react'
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';

import Authenticated from '../../../layouts/Authenticated'
import { Card, CardBody } from '../../../components/Card';
import styles from '../../styles.module.scss';
import cardResource from '../../../resources/card';
import userResource from '../../../resources/user';
import cardAccessResource from '../../../resources/cardAccess';
import FormInput, { OptionType } from '../../../components/FormInput';
import { ButtonState, InputState, APIErrors, GlobalProps, Pagination } from '../../../types';

interface Props extends GlobalProps {

}

const AddCardPage: NextPage<Props> = (props: Props) => {
	const { } = props;
	const router = useRouter();
	const resourcePath = router.pathname.split('/').slice(0, -1).join('/');

	const [serial, setSerial] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [owner, setOwner] = useState<InputState<any>>({ value: null, error: false, errorMessage: '' });
	const [role, setRole] = useState<InputState<any>>({ value: null, error: false, errorMessage: '' });
	const [btnState, setBtnState] = useState<ButtonState>('disabled');

	const [ownerPagination, setOwnerPagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '' });
	const [rolePagination, setRolePagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '' });

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setBtnState('requesting');
			
			const postData = {
				serial: serial.value ? serial.value : undefined,
				owner: owner.value ? owner.value.value : undefined,
				role_id: role.value ? role.value.value : undefined,
			}
			const result = await cardResource.postData(postData);
			if (!result) throw null;
			if (result.error) throw result.error.errors;

			Swal.fire({
				title: 'Success',
				html: 'Kartu berhasil ditambahkan',
				icon: 'success'
			}).then(() => router.push(resourcePath));
		} catch (err) {
			if (err && err.length) {
				const errors = err as APIErrors[];
				errors.map(item => {
					switch(item.location) {
						case 'serial':
							setSerial(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
						case 'owner':
							setOwner(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
						case 'role_id':
							setRole(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
					}
				});
			}
			Swal.fire({
				title: 'Error',
				text: 'Gagal menambahkan kartu',
				icon: 'error'
			});
		} finally {
			setBtnState('active');
		}
	}

	const fetchOwner = async (pagination: Pagination) => {
		try {
			const result = await userResource.getList(pagination);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			const { data: resultPagination } = result;
			const data = resultPagination.items.map(item => ({
				value: item.id,
				label: item.name,
			}));
			delete resultPagination['items'];
			delete resultPagination['kind'];
			setOwnerPagination(resultPagination);
			return data;
		} catch {
			Swal.fire({
				title: 'Error to fetch users',
				icon: 'error'
			});
			return [];
		}
	}

	const fetchRole = async (pagination: Pagination) => {
		try {
			const result = await cardAccessResource.getList(pagination);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			const { data: resultPagination } = result;
			const data = resultPagination.items.map(item => ({
				value: item.id,
				label: item.name,
			}));
			delete resultPagination['items'];
			delete resultPagination['kind'];
			setRolePagination(resultPagination);
			return data;
		} catch {
			Swal.fire({
				title: 'Error to fetch roles',
				icon: 'error'
			});
			return [];
		}
	}

	useEffect(() => {
		if (btnState !== 'requesting') {
			if (serial.value && !serial.error &&
				owner.value && !owner.error &&
				role.value && !role.error) {
				setBtnState('active');
			} else {
				setBtnState('disabled');
			}
		}
	});

	return (
		<Authenticated config={props.config} title="Kartu">
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Tambah Kartu</h5>
							</div>
							<form onSubmit={onSubmit}>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Kode Kartu</label>
									<FormInput type="text" getter={serial} setter={setSerial} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Pemilik Kartu</label>
									<FormInput type="dropdownAsync" getter={owner} setter={setOwner} pagination={ownerPagination} fetchPagination={fetchOwner} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Hak Akses</label>
									<FormInput type="dropdown" getter={role} setter={setRole} pagination={rolePagination} fetchPagination={fetchRole} />
								</div>
								<div className={cx(styles['d-flex'], styles['justify-content-end'])}>
									<button
										className={cx(styles['btn'], styles['btn-primary'])}
										disabled={btnState !== 'active'}
									>
										Tambah
									</button>
								</div>
							</form>
						</CardBody>
					</Card>
				</div>
			</div>
		</Authenticated>
	)
}

export default AddCardPage;