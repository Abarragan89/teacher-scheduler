import { getSession } from '@/lib/actions/session';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Dashboard() {

    const session = await getSession();
    if (!session || !session.user) redirect('/auth/signin');
    


    return (
        <div>Dashboard</div>
    )
}
