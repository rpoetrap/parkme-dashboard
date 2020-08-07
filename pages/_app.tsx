import App from 'next/app';
import { NextPageContext, NextComponentType } from 'next';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
moment.locale('id');

import styles from './styles.module.scss';
import authResource from '../resources/auth';
styles;

interface AppContext {
	Component: NextComponentType<NextPageContext, any, {}>;
	ctx: NextPageContext;
}

class CoreApp extends App {
	static async getInitialProps(appContext: AppContext) {
		const { Component, ctx } = appContext;
		const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

		if (ctx.req) {
			axios.defaults.headers = ctx.req.headers;
		}

		const userResponse = await authResource.getUserInfo();
		const user = userResponse?.data || {};

		return { pageProps: { ...pageProps, config: { user } } };
	}

	render() {
		const { Component, pageProps } = this.props;
		return (
			<Component {...pageProps} />
		)
	}
}

export default CoreApp;