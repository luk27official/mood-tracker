'use client';

import { Report } from '@/app/customTypes';
import '../app/globals.css';
import { checkSession, getAllReportsServer } from "@/app/userLogic";
import { useMemo, useState } from "react";
import Image from 'next/image';

export default function MoodReportsList() {

    const [username, setUsername] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [reports, setReports] = useState<Report[]>([]);

    useMemo(async () => {
        const user = await checkSession();
        if (user) setUsername(user);
        else {
            setIsInvalid(true);
            return;
        }

        const allReports = await getAllReportsServer().then((res) => {
            setReports(res);
        });
    }, []);

    if (isInvalid) return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <span className="text-xl font-bold">Wrong credentials.</span>
        </main>
    );

    const downloadReports = async () => {
        const session = JSON.parse(localStorage.getItem('session') as string);
        await fetch('/api/getAllReports', {
            method: 'POST',
            body: JSON.stringify({
                token: session.token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.blob())
            .then((blob) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `reports.json`,
                );

                document.body.appendChild(link);
                link.click();
                link.parentNode!.removeChild(link);
            });
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <span className='text-xl font-bold'>Hello, {username}!</span>
            <span>This is a list of your submitted reports. You can go back to the main page using <a href={"/"} className="text-red-500 underline cursor-pointer">this link</a>.</span>
            {reports.length !== 0 ?
                <table className="">
                    <tr>
                        <th>Date</th>
                        <th>Mood</th>
                        <th>Comment</th>
                        <th>Learned anything new?</th>
                    </tr>
                    {reports.map((report: Report) => {
                        return (
                            <tr key={report.date} className="text-center content-center">
                                <td className="p-3">{report.date.substring(0, report.date.indexOf("T"))}</td>
                                <td className="p-3"><Image src={`/${report.mood}.svg`} width={24} height={24} alt={report.mood.toString()} /></td>
                                <td className="p-3">{report.comment}</td>
                                <td className="p-3">{report.anythingNew}</td>
                            </tr>
                        );
                    })}
                </table> : <span>No reports yet.</span>}
            <span>Also, you can download a list of your reports in JSON format by <span onClick={downloadReports} className="text-red-500 underline cursor-pointer">clicking here</span>.</span>
        </main>
    );
}