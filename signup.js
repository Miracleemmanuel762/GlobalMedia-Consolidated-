import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        
        // Check if user already exists in KV storage
        const existingUser = await kv.get(`user:${normalizedEmail}`);
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        // Store the user info
        const newUser = { name, email: normalizedEmail, password }; // In a production app, hash this password!
        await kv.set(`user:${normalizedEmail}`, newUser);

        return res.status(200).json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        return res.status(500).json({ error: 'Database error. Please try again.' });
    }
}