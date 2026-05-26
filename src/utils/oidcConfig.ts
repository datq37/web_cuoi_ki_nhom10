import { keycloakClientID, keycloakAuthority } from './ip';

export const oidcConfig = {
  authority: keycloakAuthority,
  client_id: keycloakClientID,
  redirect_uri: window.location.origin,
};
