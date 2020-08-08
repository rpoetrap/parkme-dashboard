import { useState, useEffect } from 'react'
import { NextPage } from 'next';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import cx from 'classnames';
import Swal from 'sweetalert2';
import moment from 'moment';
import { IDataTableColumn } from 'react-data-table-component';

import Authenticated from '../layouts/Authenticated'
import FormInput, { OptionType } from '../components/FormInput';
import { Card, CardBody } from '../components/Card';
import GenericTable from '../components/GenericTable';
import styles from './styles.module.scss';
import { Pagination, InputState, GlobalProps } from '../types';
import { number } from '../utils/string';
import historyResource from '../resources/history';
import parkingResource from '../resources/parking';

interface Props extends GlobalProps {

}

const IndexPage: NextPage<Props> = (props: Props) => {
	const { } = props;

	const [pagination, setPagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '-created_at' });
	const [tableData, setTableData] = useState<any[]>([]);
	const [statsData, setStatsData] = useState<any[]>([]);
	const [totalIn, setTotalIn] = useState(0);
	const [totalOut, setTotalOut] = useState(0);
	const [totalEarning, setTotalEarning] = useState(0);
	const [loading, setLoading] = useState(true);

	const options = [
		{
			value: 'today',
			label: 'Hari ini'
		},
		{
			value: 'thisweek',
			label: 'Minggu ini'
		}
	];
	const [selectStats, setSelectStats] = useState<InputState<OptionType>>({ value: options[0], error: false, errorMessage: '' });

	const tableColumns: IDataTableColumn[] = [
		{
			name: 'TNKB',
			selector: 'vehicle.plate',
			sortable: true
		},
		{
			name: 'Identitas Kartu',
			selector: 'card.user.name',
			format: data => data?.card?.user?.name || '-',
			grow: 3,
			sortable: true
		},
		{
			name: 'Waktu Masuk',
			selector: 'created_at',
			grow: 2,
			format: data => moment(data.created_at).format('DD MMMM YYYY HH:mm'),
			sortable: true
		},
		{
			name: 'Lama Parkir',
			selector: 'created_at',
			format: data => {
				let time = moment(data.created_at).toNow(true);
				time = time.startsWith('se') ? `1 ${time.slice(2)}` : time;
				return time;
			},
			sortable: false
		},
	];

	const fetchStats = async () => {
		try {
			const result = await historyResource.getStats(selectStats.value.value);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			const { data: resultPagination } = result;
			setStatsData(resultPagination.items.map(item => ({ date: item.date, masuk: item.in, keluar: item.out })));
			setTotalIn(resultPagination.totalIn);
			setTotalOut(resultPagination.totalOut);
			setTotalEarning(resultPagination.totalEarning);
		} catch {
			Swal.fire({
				title: 'Error to fetch stats',
				icon: 'error'
			});
		}
	}

	const fetchTable = async () => {
		try {
			setLoading(true);
			const result = await parkingResource.getList(pagination);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			const { data: resultPagination } = result;
			setTableData(resultPagination.items);
			delete resultPagination['items'];
			delete resultPagination['kind'];
			setPagination(resultPagination);
		} catch {
			Swal.fire({
				title: 'Error to fetch gates',
				icon: 'error'
			});
		} finally {
			setLoading(false);
		}
	}

	const onDelete = (data: any) => {
		Swal.fire({
			title: 'Apakah anda yakin?',
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
		});
	}

	useEffect(() => {
		setLoading(true);
		Promise.all([
			fetchStats(),
			fetchTable()
		]).then(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchTable();
	}, [pagination.pageIndex, pagination.itemsPerPage, pagination.sorts]);

	useEffect(() => {
		fetchStats();
	}, [selectStats]);

	return (
		<Authenticated config={props.config} title="Dashboard" loading={loading}>
			<div className={styles.row}>
				<div className={cx(styles['col-12'], styles['col-lg-7'])} style={{ marginBottom: '1.875rem' }}>
					<Card>
						<CardBody>
							<h5 className={styles['mb-3']}>Statistik Kendaraan</h5>
							<ResponsiveContainer height={320} >
								<AreaChart data={statsData} >
									<CartesianGrid stroke="#f5f5f5" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Area type="monotone" dataKey="masuk" fill="#007bff" stroke="#007bff" strokeWidth={0} />
									<Area type="monotone" dataKey="keluar" fill="red" stroke="red" strokeWidth={0} />
								</AreaChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>
				</div>
				<div className={cx(styles['col-12'], styles['col-lg-5'])} style={{ marginBottom: '1.875rem' }}>
					<Card>
						<CardBody>
							<div className={styles['mb-3']} style={{ marginLeft: '-1rem', marginRight: '-1rem' }}>
								<FormInput
									id="dropdownStats"
									type="dropdown"
									data={options}
									setter={setSelectStats}
									getter={selectStats}
								/>
							</div>
							<div className={styles.row} style={{ marginLeft: '-0.5rem', marginRight: '-0.5rem' }}>
								<div className="col-12 col-md-6 col-lg-12 col-xl-6 px-2 my-2">
									<div className="card p-2 text-white bg-primary border-0" style={{ borderRadius: '0.5rem' }}>
										<small>Kendaraan Masuk</small>
										<h3 className="m-0 font-weight-normal">{number.formatNumber(totalIn)}</h3>
									</div>
								</div>
								<div className="col-12 col-md-6 col-lg-12 col-xl-6 px-2 my-2">
									<div className="card p-2 text-white bg-danger border-0" style={{ borderRadius: '0.5rem' }}>
										<small>Kendaraan Keluar</small>
										<h3 className="m-0 font-weight-normal">{number.formatNumber(totalOut)}</h3>
									</div>
								</div>
							</div>
							<div className={styles.row} style={{ marginLeft: '-0.5rem', marginRight: '-0.5rem' }}>
								<div className="col-12 px-2 my-2">
									<div className="card p-2 text-white bg-success border-0" style={{ borderRadius: '0.5rem' }}>
										<small>Penghasilan</small>
										<h3 className="m-0 font-weight-normal">{number.formatMoney(totalEarning)}</h3>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.col}>
					<Card>
						<CardBody>
							<h5 className={styles['mb-3']}>Daftar Kendaraan Parkir</h5>
							<GenericTable
								id="tableKendaraan"
								columns={tableColumns}
								data={tableData}
								routeName="test"
								getter={pagination}
								setter={setPagination}
								onDelete={onDelete}
								hideAction={true}
							/>
						</CardBody>
					</Card>
				</div>
			</div>
		</Authenticated>
	)
}

export default IndexPage
