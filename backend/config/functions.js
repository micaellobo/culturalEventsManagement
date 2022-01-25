const path = require('path');
const { access, mkdir, unlink } = require('fs').promises;

const saveFile = async (file, nameFile, diretory) => {
	if (file) {
		const newPath = path.join(diretory, `${nameFile}${path.extname(file.name)}`);
		try {
			await access(diretory);
		} catch (error) {
			await mkdir(diretory);
		}

		try {
			await file.mv(newPath);
		} catch (error) {
			console.log(error);
		}
	}
};

const deleteFile = async (nameFile, diretory) => {
	const oldPathFile = path.join(diretory, `${nameFile}`);
	await unlink(oldPathFile).catch((error) => console.log('Old file dont exits'));
};

module.exports = { saveFile, deleteFile };
