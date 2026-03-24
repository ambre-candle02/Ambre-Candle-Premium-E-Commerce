'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(username, password) {
    // In a real app, do not hardcode. Use env variables.
    const adminUser = process.env.ADMIN_USERNAME || 'ambre@012';
    const adminPass = process.env.ADMIN_PASSWORD || 'Ambre@012';

    if (username.toLowerCase().trim() === adminUser.toLowerCase().trim() && password.trim() === adminPass.trim()) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Please contact the administrator.' };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return { success: true };
}

export async function checkAdminStatus() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session');
    return token?.value === 'authenticated';
}
