import axios from '../helpers/axios';
import { API_HOST } from '../configs';
import { APIResponse } from '../types';

const authResource = {
	async login(data: any) {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/auth/login`,
			method: 'POST',
			data
		});
		return result;
	},
	
	async logout() {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/auth/logout`,
			method: 'POST'
		});
		return result;
	},
	
	async authCheck() {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/auth/check`,
			method: 'GET'
		});
		return result;
	},

	async nonauthCheck() {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/auth/nonauth`,
			method: 'GET'
		});
		return result;
	}
}

export default authResource;