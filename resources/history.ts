import queryString, { ParsedQuery } from 'query-string';
import axios from '../helpers/axios';
import GenericResource from '../helpers/GenericResource';
import { APIResponse } from '../types';
import { API_HOST } from '../configs';

class HistoryResource extends GenericResource {
	async getStats(filter: string) {
		const query: ParsedQuery<string> = { filter };
		const { data: result } = await axios.request<APIResponse>({
			url: queryString.stringifyUrl({ url: `${API_HOST}/stats`, query}),
			method: 'GET'
		});
		return result;
	}
}

const historyResource = new HistoryResource('histories');
export default historyResource;