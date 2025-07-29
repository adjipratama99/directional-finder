require('dotenv/config');
const { promises: fs } = require('fs');
const path = require('path');

const filePath = path.resolve('./db/prod-ca-2021.crt');

async function createCertFile() {
    const content = process.env.CA_CERTIFICATE;

    if (!content) {
        console.error('❌ Environment variable CA_CERTIFICATE is empty or undefined.');
        return;
    }

    try {
        await fs.writeFile(filePath, content, 'utf8');
        console.log('✅ File written successfully.');

        const exists = await fs.access(filePath).then(() => true).catch(() => false);

        if (exists) {
            console.log('✅ File confirmed to exist at:', filePath);
        } else {
            console.error('❌ File write failed – not found after write.');
        }
    } catch (err) {
        console.error('❌ Error writing file:', err);
    }
}

createCertFile();
