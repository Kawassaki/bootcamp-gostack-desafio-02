import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';
import Recipient from '../app/models/Recipient';

const models = [User, Recipient];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection));
    }
}

export default new Database();

/*
Todas as models devem ser registradas no método init, passando a instancia de conexão declarada no método init
Então toda model criada deve ser acresentada no array "models".
*/
