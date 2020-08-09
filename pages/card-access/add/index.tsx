import { useState, useEffect, FormEvent } from 'react'
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';

import Authenticated from '../../../layouts/Authenticated'
import { Card, CardBody } from '../../../components/Card';
import styles from '../../styles.module.scss';
import cardAccessResource from '../../../resources/cardAccess';
import FormInput from '../../../components/FormInput';
import { ButtonState, InputState, APIErrors, GlobalProps } from '../../../types';

interface Props extends GlobalProps {

}

const AddCardAccessPage: NextPage<Props> = (props: Props) => {
	const { } = props;
	const router = useRouter();
	const resourcePath = router.pathname.split('/').slice(0, -1).join('/');

	const [name, setName] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [description, setDescription] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [freeVehicle, setFreeVehicle] = useState<InputState<boolean>>({ value: false, error: false, errorMessage: '' });
	const [freeCharge, setFreeCharge] = useState<InputState<boolean>>({ value: false, error: false, errorMessage: '' });
	const [btnState, setBtnState] = useState<ButtonState>('disabled');

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setBtnState('requesting');
			
			const postData = {
				name: name.value ? name.value : undefined,
				description: description.value ? description.value : undefined,
				free_vehicle: freeVehicle.value,
				free_charge: freeCharge.value,
			}
			const result = await cardAccessResource.postData(postData);
			if (!result) throw null;
			if (result.error) throw result.error.errors;

			Swal.fire({
				title: 'Success',
				html: 'Hak akses berhasil ditambahkan',
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
						case 'description':
							setDescription(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
					}
				});
			}
			Swal.fire({
				title: 'Error',
				text: 'Gagal menambahkan hak akses',
				icon: 'error'
			});
		} finally {
			setBtnState('active');
		}
	}

	useEffect(() => {
		if (btnState !== 'requesting') {
			if (name.value && !name.error &&
				description.value && !description.error) {
				setBtnState('active');
			} else {
				setBtnState('disabled');
			}
		}
	});

	return (
		<Authenticated config={props.config} title="Hak Akses">
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Tambah Hak Akses</h5>
							</div>
							<form onSubmit={onSubmit}>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Nama</label>
									<FormInput type="text" getter={name} setter={setName} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Deskripsi</label>
									<FormInput type="text" getter={description} setter={setDescription} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Tanpa Biaya</label>
									<FormInput type="switch" getter={freeCharge} setter={setFreeCharge} />
								</div>
								<div className={cx(styles['form-group'], styles['row'])}>
									<label className={cx(styles['col-sm-2'], styles['col-form-label'])}>Bebas Kendaraan</label>
									<FormInput type="switch" getter={freeVehicle} setter={setFreeVehicle} />
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

export default AddCardAccessPage;