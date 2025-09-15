// migrations/20250915-change-uploaded-files-file_name-to-text.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('uploaded_files', 'file_name', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('uploaded_files', 'file_name', {
      type: Sequelize.STRING(47),
      allowNull: false,
    });
  },
};
