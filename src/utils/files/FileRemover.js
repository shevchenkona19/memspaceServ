const fs = require("fs");

export const deleteFiles = fileList => {
    fileList.forEach(file => {
        fs.unlinkSync(file);
    });
};