import type { IInitialState } from '@/services/base/typing';
import { useModel } from 'umi';

const useCheckAccess = (code: string): boolean => {
	const { initialState } = useModel('@@initialState');
	const state = initialState as IInitialState | undefined;
	const scopes = state?.authorizedPermissions?.flatMap((item) => item.scopes ?? []);

	return scopes?.includes(code) || false;
};

export default useCheckAccess;
