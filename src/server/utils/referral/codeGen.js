module.exports = {
    genStringId: () => {
        const alphabet = "abcdefghjklmnopgrstuywxqzv1234567890";
        const len = 6;
        let code = "";
        for (let i = 0; i < len; i++) {
            code += alphabet[Math.floor(Math.random() * (alphabet.length))];
        }
        return code.toUpperCase();
    },
    getIntId: (len) => {
        let num = "";
        const realLen = Math.floor((Math.random() * len) + 1);
        for (let i = 0; i < realLen; i++) {
            num += Math.floor(Math.random() * 10);
        }
        return parseInt(num);
    }
};