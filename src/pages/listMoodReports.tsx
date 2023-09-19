'use client';

import { Report } from '@/app/customTypes';
import '../app/globals.css';
import { checkSession, getAllReportsServer } from "@/app/userLogic";
import { useMemo, useState } from "react";

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

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <span className='text-xl font-bold'>Hello, {username}!</span>
            {reports.length !== 0 ? reports.map((report: Report) => {
                return <span key={report.date}>{report.anythingNew}, {report.date}, {report.id}</span>;
            }) : <span>No reports yet.</span>}
        </main>
    );
}