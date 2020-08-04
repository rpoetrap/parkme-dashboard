import queryString from 'query-string';
import axios from './axios';
import { API_HOST } from '../configs';
import { APIResponse, Pagination } from '../types';
import { valToString } from '../utils/string';

class GenericResource {
	protected resourceName: string;

	constructor(resourceName: string) {
		this.resourceName = resourceName;
	}

	async getList(pagination: Pagination) {
		const query = valToString(pagination);
		const { data: result } = await axios.request<APIResponse>({
			url: queryString.stringifyUrl({ url: `${API_HOST}/${this.resourceName}`, query}),
			method: 'GET'
		});
		return result;
	}

	async getSingle(id: number | string) {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/${this.resourceName}/${id}`,
			method: 'GET'
		});
		return result;
	}

	async postData(data: any) {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/${this.resourceName}`,
			method: 'POST',
			data
		});
		return result;
	}

	async patchData(id: number | string, data: any) {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/${this.resourceName}/${id}`,
			method: 'PATCH',
			data
		});
		return result;
	}

	async deleteData(id: number | string) {
		const { data: result } = await axios.request<APIResponse>({
			url: `${API_HOST}/${this.resourceName}/${id}`,
			method: 'DELETE'
		});
		return result;
	}
}

export default GenericResource;