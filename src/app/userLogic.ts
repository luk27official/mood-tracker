export type User = {
    username: string;
    password: string;
}

export const register = (user: User) => {
    // register user
    console.log(user)
}

export const login = (user: User) => {
    // login user
    console.log(user)
}
