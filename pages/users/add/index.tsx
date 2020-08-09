import { useState, useEffect, FormEvent } from 'react'
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';

import Authenticated from '../../../layouts/Authenticated'
import { Card, CardBody } from '../../../components/Card';
import styles from '../../styles.module.scss';
import userResource from '../../../resources/user';
import FormInput from '../../../components/FormInput';
import { ButtonState, InputState, APIErrors, GlobalProps } from '../../../types';

interface Props extends GlobalProps {

}

const AddUserPage: NextPage<Props> = (props: Props) => {
	const { } = props;
	const router = useRouter();
	const resourcePath = router.pathname.split('/').slice(0, -1).join('/');

	const [userIdentifier, setUserIdentifier] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [name, setName] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [phone, setPhone] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [admin, setAdmin] = useState<InputState<boolean>>({ value: false, error: false, errorMessage: '' });
	const [btnState, setBtnState] = useState<ButtonState>('disabled');

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setBtnState('requesting');
			
			const postData = {
				user_identifier: userIdentifier.value ? userIdentifier.value : undefined,
				name: name.value ? name.value : undefined,
				phone: phone.value ? phone.value : undefined,
				is_admin: admin.value,
			}
			const result = await userResource.postData(postData);
			if (!result) throw null;
			if (result.error) throw result.error.errors;

			Swal.fire({
				title: 'Success',
				text: 'User berhasil ditambahkan',
				icon: 'success'
			}).then(() => router.push(resourcePath));
		} catch (err) {
			if (err && err.length) {
				const errors = err as APIErrors[];
				errors.map(item => {
					switch(item.location) {
						case 'name':
							setName(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
						case 'user_identifier':
							setUserIdentifier(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
						case 'phone':
							setPhone(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
					}
				});
			}
			Swal.fire({
				title: 'Error',
				text: 'Gagal menambahkan user',
				icon: 'error'
			});
		} finally {
			setBtnState('active');
		}
	}

	useEffect(() => {
		if (btnState !== 'requesting') {
			if (name.value && !name.error &&
				userIdentifier.value && !userIdentifier.error &&
				phone.value && !phone.error) {
				setBtnState('active');
			} else {
				setBtnState('disabled');
			}
		}
	});

	return (
		<Authenticated config={props.config} title="Users">
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Tambah User</h5>
							</div>
							<form onSubmit={onSubmit}>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>ID</label>
									<FormInput type="text" getter={userIdentifier} setter={setUserIdentifier} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Nama</label>
									<FormInput type="text" getter={name} setter={setName} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Nomor Telepon</label>
									<FormInput type="text" getter={phone} setter={setPhone} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Admin</label>
									<FormInput type="switch" getter={admin} setter={setAdmin} />
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

export default AddUserPage;