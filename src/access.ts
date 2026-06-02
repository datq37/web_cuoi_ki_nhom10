import type { IInitialState } from './services/base/typing';

export default function access(initialState: IInitialState) {
	const scopes = initialState.authorizedPermissions?.flatMap((item) => item.scopes);

	return {
		accessFilter: (route: any) => scopes?.includes(route?.maChucNang) || false,
		manyAccessFilter: (route: any) => route?.listChucNang?.some((role: string) => scopes?.includes(role)) || false,
	};
}
