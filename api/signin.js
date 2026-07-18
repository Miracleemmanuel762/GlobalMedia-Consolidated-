import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

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
        let user = await redis.get(`user:${normalizedEmail}`);

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        user = JSON.parse(user);

        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        return res.status(200).json({ success: true, user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error("Redis Connection Error:", error);
        return res.status(500).json({ error: `Database error: ${error.message}` });
    }
}
