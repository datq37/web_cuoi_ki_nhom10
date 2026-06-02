const ipRoot = APP_CONFIG_IP_ROOT.replace(/\/$/, '');

const ip3 = ipRoot;

const currentRole = 'admin';
const oneSignalRole = currentRole;

const sentryDSN = APP_CONFIG_SENTRY_DSN;

export {
	ip3,
	currentRole,
	oneSignalRole,
	sentryDSN,
};
