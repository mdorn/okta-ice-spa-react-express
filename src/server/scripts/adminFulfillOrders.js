require('dotenv').config();
const request = require('request-promise');

const {
  ADMIN_CLIENT_ID,
  ADMIN_CLIENT_SECRET,
  ADMIN_SCOPES,
  OKTA_URL,
  AUTH_SERVER_ID,
  APP_URL,
} = process.env;

const updateOrders = async () => {
  const token = Buffer.from(`${ADMIN_CLIENT_ID}:${ADMIN_CLIENT_SECRET}`).toString('base64');
  try {
    const authnUri = `${OKTA_URL}/oauth2/${AUTH_SERVER_ID}/v1/token`;
    console.info(`Requesting authz token: ${authnUri}`);
    const authnRes = await request({
      uri: authnUri,
      json: true,
      method: 'POST',
      headers: {
        authorization: `Basic ${token}`,
      },
      form: {
        grant_type: 'client_credentials',
        scope: ADMIN_SCOPES,
      },
    });

    const ordersUri = `${APP_URL}/api/orders`;
    console.info(`Getting pending orders: ${ordersUri}`);
    const orders = await request({
      uri: ordersUri,
      method: 'GET',
      json: true,
      headers: {
        authorization: [authnRes.token_type, authnRes.access_token].join(' '),
      },
    });
    console.info(`There are ${orders.length} pending orders`);

    // TODO: use something like throttled-request to limit speed of API calls
    let completedCt = 0;
    for (const order of orders) {  // eslint-disable-line
      await request({  // eslint-disable-line
        uri: `${APP_URL}/api/orders/${order.orderId}/complete`,
        method: 'PATCH',
        json: true,
        headers: {
          authorization: [authnRes.token_type, authnRes.access_token].join(' '),
        },
      });
      completedCt += 1;
    }
    console.info(`${completedCt} orders completed.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

updateOrders();
