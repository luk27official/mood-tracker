'use client';

import '../app/globals.css';
import { checkSession } from "@/app/userLogic";
import { useMemo, useState } from "react";

export default function CreateMoodReport() {

    const [username, setUsername] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    useMemo(async () => {
        const user = await checkSession();
        if (user) setUsername(user);
        else setIsInvalid(true);
    }, []);

    if (isInvalid) return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Wrong credentials.</h1>
        </main>
    );

    if (!username) return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Loading...</h1>
        </main>
    );

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            <div className="justify-center text-center">
                <h2 className="text-2xl font-bold mb-2">How are you feeling today, {username}?</h2>
                <form>
                    <h3 className="text-xl font-bold">Mood</h3>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        type="button"
                    >
                        1
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        type="button"
                    >
                        2
                    </button>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        type="button"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </main>
    );
};