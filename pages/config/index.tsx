import { NextPage } from 'next';
import { useState, useEffect, FormEvent } from 'react'
import Swal from 'sweetalert2';
import cx from 'classnames';

import Authenticated from '../../layouts/Authenticated'
import { Card, CardBody } from '../../components/Card';
import styles from '../styles.module.scss';
import configResource from '../../resources/config';
import { GlobalProps, Pagination, InputState, ButtonState, APIErrors } from '../../types';
import FormInput from '../../components/FormInput';
import fileResource from '../../resources/file';

interface Props extends GlobalProps {

}

const ConfigurationPage: NextPage<Props> = (props: Props) => {
	const { } = props;

	const [logo, setLogo] = useState<InputState<any>>({ value: null, error: false, errorMessage: '' });
	const [registeredOnly, setRegisteredOnly] = useState<InputState<boolean>>({ value: false, error: false, errorMessage: '' });
	const [cost, setCost] = useState<InputState<number>>({ value: 0, error: false, errorMessage: '' });
	const [resourceData, setResourceData] = useState<any[]>([]);
	const [pagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '' });
	const [loading, setLoading] = useState(true);
	const [btnState, setBtnState] = useState<ButtonState>('disabled');

	const fetchData = async () => {
		try {
			const result = await configResource.getList(pagination);
			if (!result) throw null;
			if (result.error) throw result.error;
			const { data } = result;
			setResourceData(data.items);
			const resLogo = new File(
				[await fetch(data.items.find(item => item.key == 'logo').value || '/assets/img/logo.png')
					.then((res) => res.blob())
				],
				'logo.png',
				{ type: 'image/png' }
			);
			const resRegisteredOnly = data.items.find(item => item.key == 'registeredOnly').value === 'true';
			const resCost = parseInt(data.items.find(item => item.key == 'cost').value);
			setLogo(getter => ({ ...getter, value: resLogo }));
			setRegisteredOnly(getter => ({ ...getter, value: resRegisteredOnly }));
			setCost(getter => ({ ...getter, value: resCost }));
		} catch (err) {
			Swal.fire({
				title: 'Error to fetch configs',
				icon: 'error'
			});
		}
	}

	const elementFromResource = (resource: any, callback: (data: any) => JSX.Element) => {
		if (!resource) {
			return null;
		}
		return callback(resource);
	}

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setBtnState('requesting');
			
			for (const data of resourceData) {
				const { id, key } = data;
				let postData: any = {};

				switch (key) {
					case 'logo':
						let fileUrl = null;
						if (logo.value) {
							const uploadData = new FormData();
							uploadData.append('files', logo.value);
							const uploadResult = await fileResource.postData(uploadData)
							if (!uploadResult) throw null;
							if (uploadResult.error) {
								const e = uploadResult.error.errors;
								setLogo({ value: null, error: true, errorMessage: e ? e[0].message : '' });
								throw uploadResult.error.errors?.map(item => ({ ...item, location: key }));
							};
							fileUrl = uploadResult.data.items[0].url;
						}
						
						postData = {
							value: fileUrl
						}
						break;
					case 'registeredOnly':
						postData = {
							value: String(registeredOnly.value)
						}
						break;
					case 'cost':
						postData = {
							value: String(cost.value)
						}
						break;
				}
				const result = await configResource.patchData(id as string, postData);
				if (!result) throw null;
				if (result.error) throw result.error.errors?.map(item => ({ ...item, location: key }));
			}

			Swal.fire({
				title: 'Success',
				text: 'Konfigurasi berhasil diedit',
				icon: 'success',
				onRender: () => fetchData()
			});
		} catch (err) {
			if (err && err.length) {
				const errors = err as APIErrors[];
				errors.map(item => {
					switch(item.location) {
						case 'logo':
							setLogo(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
						case 'registeredOnly':
							setRegisteredOnly(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
						case 'cost':
							setCost(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
					}
				});
			}
			Swal.fire({
				title: 'Error',
				text: 'Gagal mengedit konfigurasi',
				icon: 'error'
			});
		} finally {
			setBtnState('active');
		}
	}

	useEffect(() => {
		setLoading(true);
		fetchData().then(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (btnState !== 'requesting') {
			if (logo.value && !logo.error &&
				!registeredOnly.error &&
				cost.value >= 0 && !cost.error) {
				setBtnState('active');
			} else {
				setBtnState('disabled');
			}
		}
	});

	return (
		<Authenticated config={props.config} title="Konfigurasi" loading={loading}>
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<form onSubmit={onSubmit}>
								{elementFromResource(resourceData.find(item => item.key == 'logo'), (data) => (
									<div className={cx(styles['form-group'], styles['row'])}>
										<label className={styles['col-sm-2']}>{data.label}</label>:
										<FormInput type="file" accept='image/*' getter={logo} setter={setLogo} />
									</div>
								))}
								{elementFromResource(resourceData.find(item => item.key == 'registeredOnly'), (data) => (
									<div className={cx(styles['form-group'], styles['row'])}>
										<label className={styles['col-sm-2']}>{data.label}</label>:
										<FormInput type="switch" getter={registeredOnly} setter={setRegisteredOnly} />
									</div>
								))}
								{elementFromResource(resourceData.find(item => item.key == 'cost'), (data) => (
									<div className={cx(styles['form-group'], styles['row'])}>
										<label className={styles['col-sm-2']}>{data.label}</label>:
										<FormInput type="currency" getter={cost} setter={setCost} />
									</div>
								))}
								<div className={cx(styles['d-flex'], styles['justify-content-end'])}>
									<button
										className={cx(styles['btn'], styles['btn-primary'])}
										disabled={btnState !== 'active'}
									>
										Simpan
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

export default ConfigurationPage;