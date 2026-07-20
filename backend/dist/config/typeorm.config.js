"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionSource = exports.dataSourceOptions = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'taskflow',
    password: process.env.DATABASE_PASSWORD || 'taskflow_password',
    database: process.env.DATABASE_NAME || 'taskflow_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
};
exports.default = (0, config_1.registerAs)('typeorm', () => exports.dataSourceOptions);
exports.connectionSource = new typeorm_1.DataSource(exports.dataSourceOptions);
//# sourceMappingURL=typeorm.config.js.map