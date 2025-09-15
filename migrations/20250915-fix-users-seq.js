// migrations/20250915-fix-users-seq.js
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('public.users','id'),
        COALESCE((SELECT MAX(id) FROM public.users), 0)
      );
    `);
  },
  async down() {
    // no-op
  },
};
