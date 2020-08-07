import { useState, useEffect, FormEvent } from 'react'
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';

import Authenticated from '../../../../layouts/Authenticated'
import { Card, CardBody } from '../../../../components/Card';
import styles from '../../../styles.module.scss';
import userResource from '../../../../resources/user';
import FormInput from '../../../../components/FormInput';
import { ButtonState, InputState, APIErrors, GlobalProps } from '../../../../types';
import GenericError from '../../../../components/GenericError';

interface Props extends GlobalProps {

}

const EditUserPage: NextPage<Props> = (props: Props) => {
	const { } = props;
	const router = useRouter();
	const { id } = router.query;
	const resourcePath = router.pathname.split('/').slice(0, -2).join('/');

	const [resourceData, setResourceData] = useState<any>(null);
	const [userIdentifier, setUserIdentifier] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [name, setName] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [phone, setPhone] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [loading, setLoading] = useState(true);
	const [btnState, setBtnState] = useState<ButtonState>('disabled');

	const fetchData = async () => {
		try {
			const result = await userResource.getSingle(id as string);
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data } = result;
			setResourceData(data);
			setUserIdentifier(getter => ({ ...getter, value: data.user_identifier }));
			setName(getter => ({ ...getter, value: data.name }));
			setPhone(getter => ({ ...getter, value: data.phone }));
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch user',
				text: err.code === 404 ? 'Not Found' : undefined,
				icon: 'error'
			}).then(() => router.push(resourcePath));
		}
	}

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setBtnState('requesting');
			
			const postData = {
				user_identifier: userIdentifier.value ? userIdentifier.value : undefined,
				name: name.value ? name.value : undefined,
				phone: phone.value ? phone.value : undefined,
			}
			const result = await userResource.patchData(id as string, postData);
			if (!result) throw null;
			if (result.error) throw result.error.errors;

			Swal.fire({
				title: 'Success',
				text: 'User berhasil diedit',
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
				text: 'Gagal mengedit user',
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

	useEffect(() => {
		setLoading(true);
		if (!id) return;
		fetchData().then(() => setLoading(false));
	}, [id]);

	if (!loading && !resourceData) return <GenericError />
	return (
		<Authenticated config={props.config} title="Users">
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Edit User</h5>
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
								<div className={cx(styles['d-flex'], styles['justify-content-end'])}>
									<button
										className={cx(styles['btn'], styles['btn-primary'])}
										disabled={btnState !== 'active'}
									>
										Edit
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

export default EditUserPage;