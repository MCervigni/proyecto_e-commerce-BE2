import { UserManagerMongoDB as UserManager } from "../dao/UserManagerMongoDB.js";

class UsersRepository {
    #usersDAO;
    constructor(usersDAO){
        this.#usersDAO = usersDAO;
    }
}

export const usersService=new UsersRepository(UserManager)