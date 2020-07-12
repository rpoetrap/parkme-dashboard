import { FunctionComponent } from 'react'
import moment from 'moment';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Select from 'react-select';

import Authenticated from '../layouts/Authenticated'

interface Props {

}

const IndexPage: FunctionComponent<Props> = (props: Props) => {
  const { } = props;
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
  return (
    <Authenticated title="Dashboard">
      <div>
        <h2 className="d-inline-block">Dashboard</h2>
        <div className="d-none d-md-block float-right bg-white rounded shadow-sm" style={{ padding: '0.625rem 1rem' }}>
          {moment().format('DD MMMM YYYY HH:mm')}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 col-lg-7" style={{ marginBottom: '1.875rem' }}>
          <div className="card shadow-sm">
            <div style={{ padding: '30px' }}>
              <ResponsiveContainer height={320} >
                <AreaChart data={data} >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="amt" fill="blue" stroke="#8884d8" />
                  <Area type="monotone" dataKey="pv" fill="red" stroke="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-5" style={{ marginBottom: '1.875rem' }}>
          <div className="card shadow-sm h-100">
            <div className="d-flex flex-column" style={{ padding: '1.875rem' }}>
              <div className="mb-3">
                <Select
                  options={options}
                />
              </div>
              <div className="row" style={{ marginLeft: '-0.5rem', marginRight: '-0.5rem' }}>
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
              <div className="row" style={{ marginLeft: '-0.5rem', marginRight: '-0.5rem' }}>
                <div className="col-12 px-2 my-2">
                  <div className="card p-2 text-white bg-success border-0" style={{ borderRadius: '0.5rem' }}>
                    <small>Penghasilan</small>
                    <h3 className="m-0 font-weight-normal">Rp 10.023</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

export default IndexPage
