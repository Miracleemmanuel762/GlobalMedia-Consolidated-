import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    // We pass the email as a query parameter: /api/get-user?email=user@example.com
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email parameter is required.' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const userData = await redis.get(`user:${normalizedEmail}`);

        if (!userData) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = JSON.parse(userData);

        // Send back only the full name securely
        return res.status(200).json({ name: user.name });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user from database.' });
    }
                                      }
  
