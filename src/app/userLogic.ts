'use client';

import { User } from "./customTypes";

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

export const submitReport = async (token: string, mood: number, date: string, comment: string, anythingNew: string) => {
    return await fetch('/api/uploadReport', {
        method: 'POST',
        body: JSON.stringify({
            token: token,
            mood: mood,
            date: date,
            comment: comment,
            anythingNew: anythingNew
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).catch((err) => {
        console.log(err);
        return null;
    });
};

export const getAllReportsServer = async () => {
    if (typeof window == 'undefined') return;
    const session = JSON.parse(localStorage.getItem('session') as string);
    return await getAllReports(session.token);
};

export const getAllReports = async (token: string) => {
    return await fetch('/api/getAllReports', {
        method: 'POST',
        body: JSON.stringify({
            token: token
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).catch((err) => {
        console.log(err);
        return null;
    });
};
