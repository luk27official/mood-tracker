'use client';

export type User = {
    username: string;
    password: string;
};

export const register = async (user: User) => {
    // register user
    const registration = await fetch('/api/registerUser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (res.status == 201) {
            return true;
        }
        return false;
    }).catch((err) => {
        console.log(err);
    });

    return registration;
};

export const login = async (user: User) => {
    // login user
    const session = await fetch('/api/loginUser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (res.status == 401) {
            console.log("fail");
            return;
        }
        return res.json();
    }).catch((err) => {
        console.log(err);
    });

    if (!session) localStorage.setItem('session', '{}');
    else localStorage.setItem('session', JSON.stringify(session));
};

export const checkSession = async () => {
    // check session
    if (typeof window == 'undefined') return;
    const session = JSON.parse(localStorage.getItem('session') as string);

    if (session) {
        const result = await fetch('/api/checkSession', {
            method: 'POST',
            body: JSON.stringify(session),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status == 401) {
                return null;
            }
            return res.json();
        }).catch((err) => {
            console.log(err);
        });

        return result;
    }
};