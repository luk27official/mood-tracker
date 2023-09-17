export type User = {
    username: string;
    password: string;
}

export const register = async (user: User) => {
    // register user
    console.log(user);

    await fetch('/api/registerUser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
}

export const login = async (user: User) => {
    // login user
    console.log(user);

    const session = await fetch('/api/loginUser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        console.log(res);
        return res.json();
    }).catch((err) => {
        console.log(err);
    });

    localStorage.setItem('session', JSON.stringify(session));
}

export const checkSession = async () => {
    // check session
    const session = JSON.parse(localStorage.getItem('session') as string);
    console.log(session);

    if (session) {
        const result = await fetch('/api/checkSession', {
            method: 'POST',
            body: JSON.stringify(session),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res);
            return res.json();
        }).catch((err) => {
            console.log(err);
        });

        console.log(result);
        return result;
    }
}