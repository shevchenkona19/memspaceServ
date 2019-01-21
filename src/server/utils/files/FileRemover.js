const fs = require("fs");

const deleteFiles = fileList => {
    fileList.forEach(file => {
        fs.unlinkSync(file);
    });
};

module.exports = {deleteFiles};