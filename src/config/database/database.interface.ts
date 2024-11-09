
export interface IDatabaseConfigAttributes {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number | string;
    dialect?: string;
    urlDatabase?: string;
    define ?: object;
    pool ?: object;
    logging ? : SequelizeLoggingFunction
    dialectOptions ? : object ;
    timezone ? : string;
}

export interface IDatabaseConfig {
    development: IDatabaseConfigAttributes;
    test: IDatabaseConfigAttributes;
    production: IDatabaseConfigAttributes;
}



export interface SequelizeLoggingFunction {
    (msg: string): void; // Logging function takes a string message and returns void
}
  