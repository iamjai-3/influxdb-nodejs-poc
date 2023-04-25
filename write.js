const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const dotenv = require('dotenv');
dotenv.config();

/** Environment variables **/
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
console.log('bucket', bucket);

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
const influxDB = new InfluxDB({ url, token });

/**
 * Create a write client from the getWriteApi method.
 * Provide your `org` and `bucket`.
 **/
const writeApi = influxDB.getWriteApi(org, bucket);

/**
 * Apply default tags to all points.
 **/
writeApi.useDefaultTags({ region: 'west' });

/**
 * Create a point and write it to the buffer.
 **/
const point1 = new Point('temperature')
  .tag('sensor_id', 'TLM01')
  .floatField('value', 24.0);
  
console.log(` ${point1}`);

writeApi.writePoint(point1);

/**
 * Flush pending writes and close writeApi.
 **/

writeApi.close().then(() => {
  console.log('WRITE FINISHED');
});
