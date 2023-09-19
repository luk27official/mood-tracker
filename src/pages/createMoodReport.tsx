'use client';

import '../app/globals.css';
import { checkSession } from "@/app/userLogic";
import Image from 'next/image';
import { useMemo, useState } from "react";
import { getDayBefore, getTodayDate } from '@/app/dateLogic';

export default function CreateMoodReport() {

    const [username, setUsername] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const [mood, setMood] = useState(0);
    const [date, setDate] = useState(getTodayDate());
    const [comment, setComment] = useState('');
    const [anythingNew, setAnythingNew] = useState('');

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

    const handleMoodClick = (mood: number) => {
        setMood(mood);
    };

    const imageNames = [1, 2, 3, 4, 5];

    const handleChangeDate = () => {
        // convert date from string to Date object
        const dateObject = Date.parse(date);
        setDate(getDayBefore(dateObject));
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleAnythingNewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnythingNew(e.target.value);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            <div className="justify-center text-center">
                <h2 className="text-2xl font-bold mb-2">How are you feeling today, {username}?</h2>
                <form>
                    <h3 className="text-xl font-bold">Date</h3>
                    Today, it is {date} (or too early the day after).<br />
                    <span onClick={() => { handleChangeDate(); }} className="underline">Change to the day before</span><br />
                    <span onClick={() => { setDate(getTodayDate()); }} className="underline">Change to today</span>
                    <h3 className="text-xl font-bold">Mood</h3>
                    <div className="flex flex-row justify-center gap-3">
                        {imageNames.map((imageName) => (
                            <Image src={`/${imageName}.svg`} width={64} height={64} alt={imageName.toString()} key={imageName} onClick={(e) => handleMoodClick(imageName)} className={(mood === imageName) ? "border-double border-4 border-sky-500" : "none"} />
                        ))}
                    </div>
                    <h3 className="text-xl font-bold">Comment</h3>
                    <textarea className="border-2 border-gray-300 rounded-md p-2 w-full h-60" id="comment" onChange={(e) => handleCommentChange(e)} />
                    <h3 className="text-xl font-bold">Did you learn anything new today?</h3>
                    <textarea className="border-2 border-gray-300 rounded-md p-2 w-full h-36" id="anythingNew" onChange={(e) => handleAnythingNewChange(e)} />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        type="button"
                    >
                        Submit
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-4"
                        type="button"
                    >
                        List my reports
                    </button>
                </form>
            </div>
        </main>
    );
};