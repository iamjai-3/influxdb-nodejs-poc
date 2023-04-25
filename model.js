const Influx = require('influx');

const userSchema = {
  id: Influx.FieldType.INTEGER,
  firstName: Influx.FieldType.STRING,
  lastName: Influx.FieldType.STRING,
  email: Influx.FieldType.STRING,
  age: Influx.FieldType.FLOAT,
};

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'test',
  schema: [
    {
      measurement: 'users',
      fields: userSchema,
      tags: ['id'],
    },
  ],
});

class UserRepository {
  async create(user) {
    await influx.writePoints([
      {
        measurement: 'users',
        tags: { id: user.id.toString() },
        fields: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
        },
      },
    ]);
  }

  async read(id) {
    const result = await influx.query(
      `SELECT * FROM users WHERE id = ${id} LIMIT 1`
    );

    const user = result[0];

    if (user) {
      return {
        id: parseInt(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: parseFloat(user.age),
      };
    }

    return undefined;
  }

  async update(id, updates) {
    const fields = Object.entries(updates)
      .map(([key, value]) => `${key} = ${Influx.escape.stringLit(value)}`)
      .join(', ');

    await influx.query(`UPDATE users SET ${fields} WHERE id = ${id}`);
  }

  async delete(id) {
    await influx.query(`DELETE FROM users WHERE id = ${id}`);
  }
}

const test = new UserRepository();

test.create({
  id: 1,
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  age: 1.2,
});

module.exports = UserRepository;
