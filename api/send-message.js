const twilio = require('twilio');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, phone, service, message } = req.body || {};

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
        const toNumber = process.env.YOUR_WHATSAPP_NUMBER;

        if (!accountSid || !authToken || !fromNumber || !toNumber) {
            return res.status(500).json({ error: 'Missing Twilio environment variables' });
        }

        const client = twilio(accountSid, authToken);

        await client.messages.create({
            from: fromNumber,
            to: toNumber,
            body: `🚀 New Inquiry - Celeste IT

👤 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone || 'N/A'}
🛠 Service: ${service || 'N/A'}

💬 Message:
${message}`
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Twilio send failed:', error);
        return res.status(500).json({
            error: error.message || 'Failed to send WhatsApp message'
        });
    }
}