import { DirectionalFinder } from "./directionalFinder.model";
import { UploadedFile } from "./uploadedFiles.model";

DirectionalFinder.hasMany(UploadedFile, {
    foreignKey: 'directionalFinderId',
    as: 'files',
});
UploadedFile.belongsTo(DirectionalFinder, {
    foreignKey: 'directionalFinderId',
    as: 'directionalFinder',
    targetKey: 'id',
    constraints: true
});
