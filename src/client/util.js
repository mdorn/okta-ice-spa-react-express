import uuidv4 from 'uuid/v4';
import buildUrl from 'build-url';

/** Workaround helper for the Okta Sign-In Widget when it uses IdP disco.
  See https://github.com/okta/okta-signin-widget/issues/566 */
function handleIdpDiscovery(authConfig) {
  const state = uuidv4();
  const nonce = uuidv4();
  const responseType = ['id_token', 'token'];
  const cookie = 'okta-oauth-redirect-params=' + JSON.stringify({
    responseType,
    state: state,
    nonce: nonce,
    'okta-oauth-nonce': nonce,
    'okta-oauth-state': state,
    scopes: authConfig.scope,
    urls: {
      issuer: authConfig.issuer,
    },
  });
  const authUrl = buildUrl(authConfig.issuer, {
    path: 'v1/authorize',
    queryParams: {
      response_type: responseType.join(' '),
      client_id: authConfig.client_id,
      scope: authConfig.scope.join(' '),
      redirect_uri: authConfig.redirect_uri,
      state,
      nonce,
    }
  });
  return { cookie, authUrl };
}


export { handleIdpDiscovery };
