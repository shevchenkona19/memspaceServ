module.exports = function (db, DataTypes) {
    const MemeIds = db.define('memeIds', {
        memeId: {type: DataTypes.INTEGER},
        groupId: {type: DataTypes.INTEGER},
    }, {timestamps: false});

    return MemeIds;
};