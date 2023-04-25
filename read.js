const { InfluxDB } = require('@influxdata/influxdb-client');
const dotenv = require('dotenv');
dotenv.config();

/** Environment variables **/
const url = process.env.INFLUX_URL || '';
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG || '';

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 *
 * Get a query client configured for your org.
 **/
const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

/** To avoid SQL injection, use a string literal for the query. */
const fluxQuery =
  'from(bucket:"poc") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")';

const myQuery = async () => {
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const result = tableMeta.toObject(values);
    console.log('result', result);
  }
};

/** Execute a query and receive line table metadata and rows. */
myQuery();
