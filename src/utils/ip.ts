const ipRoot = process.env.NODE_ENV === 'development' ? '/api/v1' : APP_CONFIG_IP_ROOT.replace(/\/$/, '');

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
