import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.validateStatus = () => true;

export default axios;