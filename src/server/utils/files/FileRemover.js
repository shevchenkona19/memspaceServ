const fs = require("fs");

const deleteFiles = fileList => {
    fileList.forEach(file => {
        if (fs.existsSync(file))
            fs.unlinkSync(file);
    });
};

module.exports = {deleteFiles};