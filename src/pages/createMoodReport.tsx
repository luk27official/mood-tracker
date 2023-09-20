'use client';

import '../app/globals.css';
import { checkSession, getAllReports, getAllReportsServer, submitReport } from "@/app/userLogic";
import Image from 'next/image';
import { useMemo, useState } from "react";
import { getDayBefore, getTodayDate } from '@/app/dateLogic';
import { Report } from '@/app/customTypes';
import { useRouter } from 'next/navigation';

export default function CreateMoodReport() {
    const [username, setUsername] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const [mood, setMood] = useState(3);
    const [date, setDate] = useState(getTodayDate());
    const [comment, setComment] = useState('');
    const [anythingNew, setAnythingNew] = useState('');

    const [submitStatus, setSubmitStatus] = useState('');
    const router = useRouter();

    useMemo(async () => {
        const user = await checkSession();
        if (user) setUsername(user);
        else {
            setIsInvalid(true);
            return;
        }

        //check whether the user has already submitted a report today
        const allReports = await getAllReportsServer();
        allReports.forEach((report: Report) => {
            const date = Date.parse(report.date);
            const dateObject = new Date(date);

            const todayDate = Date.parse(getTodayDate());
            const todayDateObject = new Date(todayDate);

            if (dateObject.setHours(0, 0, 0, 0) === todayDateObject.setHours(0, 0, 0, 0)) {
                setIsDone(true);
            }
        });

    }, []);

    const handleListReports = async () => {
        router.push('/listMoodReports');
    };

    if (isInvalid) return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <span className="text-xl font-bold">Wrong credentials.</span>
        </main>
    );

    if (isDone) return (
        <main className="flex min-h-screen flex-col items-center justify p-12">
            <span className="text-xl font-bold">You have already submitted a report today, {username}. Come back tomorrow!</span>
            <span className="text-xl font-bold">You can still view your previous reports using the following button.</span>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-4"
                type="button"
                onClick={handleListReports}
            >
                List my reports
            </button>
        </main>
    );

    if (!username) return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <span className="text-xl font-bold">Loading...</span>
        </main>
    );

    const handleMoodClick = (mood: number) => {
        setMood(mood);
    };

    const imageNames = [1, 2, 3, 4, 5];

    const handleChangeDate = () => {
        const dateTimestamp = Date.parse(date);
        setDate(getDayBefore(dateTimestamp));
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleAnythingNewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnythingNew(e.target.value);
    };

    const handleSubmit = async () => {
        const session = JSON.parse(localStorage.getItem('session') as string);
        const submit = await submitReport(session.token, mood, date, comment, anythingNew);
        if (submit !== null) {
            setSubmitStatus('Report submitted successfully.');
        } else {
            setSubmitStatus('Report submission failed, try again.');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            <div className="justify-center text-center">
                <span className="text-2xl font-bold mb-2">How are you feeling today, {username}?</span>
                <form>
                    Today, it is {date} (or too early the day after).<br />
                    <span onClick={() => { handleChangeDate(); }} className="underline cursor-pointer">Change to the day before</span><br />
                    <span onClick={() => { setDate(getTodayDate()); }} className="underline cursor-pointer">Change to today</span>
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
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-4"
                        type="button"
                        onClick={handleListReports}
                    >
                        List my reports
                    </button>
                    <p className="text-xl mt-4">{submitStatus}</p>
                    <p className="text-opacity-75">Mood icons <a href="https://www.freepik.com/free-vector/emoji-satisfaction-meter-small_44156211.htm#query=satisfaction%20smile&position=0&from_view=keyword&track=ais">by juicy_fish</a> on Freepik</p>
                </form>
            </div>
        </main>
    );
};