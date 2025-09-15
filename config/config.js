// config/config.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pg = require('pg');

const must = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
};

const DATABASE_URL = must('DATABASE_URL');

// Kalau masih suka nembak IPv6 dan EHOSTUNREACH, export ini di shell:
// export NODE_OPTIONS=--dns-result-order=ipv4first

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
        // ca: fs.readFileSync(path.join(__dirname, process.env.CRT_PATH))
      },
      channelBinding: 'disable',
    },
    // optional: logging: console.log,
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        ca: fs.readFileSync(path.join(__dirname, process.env.CRT_PATH))
      },
      channelBinding: 'disable',
    },
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
        // ca: fs.readFileSync(path.join(__dirname, process.env.CRT_PATH))
      },
      channelBinding: 'disable',
    },
  }
};