import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import './styles/global.less';

/**  loading */
export const initialStateConfig = {
	loading: <></>,
};

export async function getInitialState(): Promise<{ settings?: any; currentUser?: any }> {
	return {
		settings: {},
	};
}

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
	errorHandler: (error: any) => {
		throw error;
	},
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	return {
		disableContentMargin: false,
		onPageChange: () => {
			const { location } = history;
			// add your logic here
		},
		menuHeaderRender: undefined,
		...initialState?.settings,
	};
};
