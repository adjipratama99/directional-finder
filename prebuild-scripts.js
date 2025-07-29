require('dotenv/config');
const { writeFileSync } = require('fs');

const content = process.env.CA_CERTIFICATE;

writeFileSync('./db/prod-ca-2021.crt', content);