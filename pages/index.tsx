import { FunctionComponent, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import cx from 'classnames';
import Swal from 'sweetalert2';
import moment from 'moment';

import Authenticated from '../layouts/Authenticated'
import FormInput from '../components/FormInput';
import { Card, CardBody } from '../components/Card';
import GenericTable from '../components/GenericTable';
import styles from './styles.module.scss';
import { IDataTableColumn } from 'react-data-table-component';
import { Pagination } from '../types';

interface Props {

}

const IndexPage: FunctionComponent<Props> = (props: Props) => {
	const { } = props;

	const [pagination, setPagination] = useState<Pagination>({ pageIndex: 1, itemsPerPage: 10, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '' });
	const data = [
		{
			name: 'Page A', uv: 590, pv: 800, amt: 1400, cnt: 490,
		},
		{
			name: 'Page B', uv: 868, pv: 967, amt: 1506, cnt: 590,
		},
		{
			name: 'Page C', uv: 1397, pv: 1098, amt: 989, cnt: 350,
		},
		{
			name: 'Page D', uv: 1480, pv: 1200, amt: 1228, cnt: 480,
		},
		{
			name: 'Page E', uv: 1520, pv: 1108, amt: 1100, cnt: 460,
		},
		{
			name: 'Page F', uv: 1400, pv: 680, amt: 1700, cnt: 380,
		},
	];

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
	const [selectStats, setSelectStats] = useState(options[0]);

	const tableData = [
		{ id: 1, plate: 'S6187NJ', owner: 'Bambang', created_at: moment().subtract(1, 'minute').toDate() },
	];
	const tableColumns: IDataTableColumn[] = [
		{
			name: 'TNKB',
			selector: 'plate',
			sortable: true
		},
		{
			name: 'Identitas Kartu',
			selector: 'owner',
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

	console.log(pagination);

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

	return (
		<Authenticated title="Dashboard">
			<div className={styles.row}>
				<div className={cx(styles['col-12'], styles['col-lg-7'])} style={{ marginBottom: '1.875rem' }}>
					<Card>
						<CardBody>
							<h5 className={styles['mb-3']}>Statistik Kendaraan</h5>
							<ResponsiveContainer height={320} >
								<AreaChart data={data} >
									<CartesianGrid stroke="#f5f5f5" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Area type="natural" dataKey="amt" fill="#007bff" stroke="#007bff" strokeWidth={0} dot={true} />
									<Area type="natural" dataKey="pv" fill="red" stroke="red" strokeWidth={0} dot={true} />
								</AreaChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>
				</div>
				<div className={cx(styles['col-12'], styles['col-lg-5'])} style={{ marginBottom: '1.875rem' }}>
					<Card>
						<CardBody>
							<div className={styles['mb-3']}>
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
										<h3 className="m-0 font-weight-normal">10.023</h3>
									</div>
								</div>
								<div className="col-12 col-md-6 col-lg-12 col-xl-6 px-2 my-2">
									<div className="card p-2 text-white bg-danger border-0" style={{ borderRadius: '0.5rem' }}>
										<small>Kendaraan Keluar</small>
										<h3 className="m-0 font-weight-normal">10.023</h3>
									</div>
								</div>
							</div>
							<div className={styles.row} style={{ marginLeft: '-0.5rem', marginRight: '-0.5rem' }}>
								<div className="col-12 px-2 my-2">
									<div className="card p-2 text-white bg-success border-0" style={{ borderRadius: '0.5rem' }}>
										<small>Penghasilan</small>
										<h3 className="m-0 font-weight-normal">Rp 10.023</h3>
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
							<h5 className={styles['mb-3']}>Daftar Kendaraan</h5>
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
