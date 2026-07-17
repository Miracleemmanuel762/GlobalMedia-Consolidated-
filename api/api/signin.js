import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        
        // Fetch user from Vercel KV
        const user = await kv.get(`user:${normalizedEmail}`);

        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Authentication successful
        return res.status(200).json({ success: true, message: 'Login successful!', user: { name: user.name, email: user.email } });
    } catch (error) {
        return res.status(500).json({ error: 'Database error. Please try again.' });
    }
}
