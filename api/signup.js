import Redis from 'ioredis';

// Automatically connects using Vercel's standard injected Redis environment variable
const redis = new Redis(process.env.REDIS_URL);

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
        
        // Check if user exists
        const existingUser = await redis.get(`user:${normalizedEmail}`);
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        // Save user structure
        const newUser = { name, email: normalizedEmail, password };
        await redis.set(`user:${normalizedEmail}`, JSON.stringify(newUser));

        return res.status(200).json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error("Redis Connection Error:", error);
        return res.status(500).json({ error: `Database error: ${error.message}` });
    }
            }
