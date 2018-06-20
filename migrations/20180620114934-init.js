'use strict';

let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable("users", {
        userId: {type: "integer", primaryKey: true},
        username: {type: "string", notNull: true},
        password: {type: "string", notNull: true},
        email: {type: "string", notNull: true},
        imageData: {type: 'binary'},
        accessLvl: {type: 'integer', defaultValue: 0},
        favorites: {type: 'string', defaultValue: '[]'}
    })
        .then(() => db.createTable("images", {
            imageId: {type: 'integer', primaryKey: true},
            imageDate: {type: 'binary', notNull: true},
            likes: {type: 'integer', defaultValue: 0},
            dislikes: {type: 'integer', defaultValue: 0},
            comments: {type: 'integer', defaultValue: 0},
            isChecked: {type: 'smallint', defaultValue: 0},
            source: 'string',
            height: {type: 'integer', defaultValue: 0},
            width: {type: 'integer', defaultValue: 0}
        }))
        .then(() => db.createTable("categories", {
            categoryId: {type: 'integer', primaryKey: true},
            categoryName: {type: 'string', notNull: true}
        }))
        .then(() => db.createTable("comments", {
            id: {type: 'integer', primaryKey: true},
            userId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'comments_userId_fkey',
                    table: 'users',
                    rules: {
                        onDelete: "CASCADE",
                        onUpdate: "RESTRICT",
                    },
                    mapping: 'userId'
                }
            },
            imageId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'comments_imageId_fkey',
                    table: 'images',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT',
                    },
                    mapping: 'imageId'
                }
            },
            text: {type: 'string', notNull: true},
            date: {type: 'timestamp', notNull: true}
        }))
        .then(() => db.createTable("userscategories", {
            userId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'userscategories_categoryid_fkey',
                    table: 'users',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT',
                    },
                    mapping: 'userId'
                }
            },
            categoryId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'userscategories_userid_fkey',
                    table: 'categories',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT',
                    },
                    mapping: 'categoryId'
                }
            }
        }))
        .then(() => db.createTable("imagescategories", {
            imageId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'imagescategories_categoryid_fkey',
                    table: 'images',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT',
                    },
                    mapping: 'imageId'
                }
            },
            categoryId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'imagescategories_imageid_fkey',
                    table: 'categories',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT',
                    },
                    mapping: 'categoryId'
                }
            }
        }))
        .then(() => db.createTable("favorites", {
            userId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'favorites_userid_fkey',
                    table: 'users',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT',
                    },
                    mapping: 'userId'
                }
            },
            imageId: {
                type: 'integer', notNull: true, foreignKey: {
                    name: 'favorites_imageid_fkey',
                    table: 'images',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT',
                    },
                    mapping: 'imageId'
                }
            }
        }))
        .then(() => console.log("init migration success!"))

};

exports.down = function (db) {
    return db.dropTable("favorites")
        .then(() => db.dropTable("imagescategories"))
        .then(() => db.dropTable("userscategories"))
        .then(() => db.dropTable("comments"))
        .then(() => db.dropTable("categories"))
        .then(() => db.dropTable("images"))
        .then(() => db.dropTable("users"))
        .then(() => console.log("dropped init success"));
};

exports._meta = {
    "version": 1
};
