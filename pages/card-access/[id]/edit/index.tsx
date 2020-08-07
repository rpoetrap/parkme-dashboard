import { useState, useEffect, FormEvent } from 'react'
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import cx from 'classnames';

import Authenticated from '../../../../layouts/Authenticated'
import { Card, CardBody } from '../../../../components/Card';
import styles from '../../../styles.module.scss';
import cardAccessResource from '../../../../resources/cardAccess';
import FormInput from '../../../../components/FormInput';
import { ButtonState, InputState, APIErrors, GlobalProps } from '../../../../types';
import GenericError from '../../../../components/GenericError';

interface Props extends GlobalProps {

}

const EditCardAccessPage: NextPage<Props> = (props: Props) => {
	const { } = props;
	const router = useRouter();
	const { id } = router.query;
	const resourcePath = router.pathname.split('/').slice(0, -2).join('/');

	const [resourceData, setResourceData] = useState<any>(null);
	const [name, setName] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [description, setDescription] = useState<InputState<string>>({ value: '', error: false, errorMessage: '' });
	const [freeVehicle, setFreeVehicle] = useState<InputState<boolean>>({ value: false, error: false, errorMessage: '' });
	const [freeCharge, setFreeCharge] = useState<InputState<boolean>>({ value: false, error: false, errorMessage: '' });
	const [loading, setLoading] = useState(true);
	const [btnState, setBtnState] = useState<ButtonState>('disabled');

	const fetchData = async () => {
		try {
			const result = await cardAccessResource.getSingle(id as string);
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data } = result;
			setResourceData(data);
			setName(getter => ({ ...getter, value: data.name }));
			setDescription(getter => ({ ...getter, value: data.description }));
			setFreeVehicle(getter => ({ ...getter, value: data.free_vehicle }));
			setFreeCharge(getter => ({ ...getter, value: data.free_charge }));
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch card access',
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
				name: name.value ? name.value : undefined,
				description: description.value ? description.value : undefined,
				free_charge: freeCharge.value,
				free_vehicle: freeVehicle.value,
			}
			const result = await cardAccessResource.patchData(id as string, postData);
			if (!result) throw null;
			if (result.error) throw result.error.errors;

			Swal.fire({
				title: 'Success',
				text: 'Hak akses berhasil diedit',
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
				text: 'Gagal mengedit hak akses',
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

	useEffect(() => {
		setLoading(true);
		if (!id) return;
		fetchData().then(() => setLoading(false));
	}, [id]);

	if (!loading && !resourceData) return <GenericError />
	return (
		<Authenticated config={props.config} title="Hak Akses">
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<div className={cx(styles['mb-3'], styles['d-flex'])}>
								<h5 className={styles['mr-auto']}>Edit Hak Akses</h5>
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

export default EditCardAccessPage;