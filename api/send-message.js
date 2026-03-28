export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { name, email, phone, service, message } = req.body;

    const accountSid = "OR0b7a48652547a3588d504103a4813d23";
    const authToken = "4157772a09de67237561d8c9cbca08b5";

    const client = require('twilio')(accountSid, authToken);

    try {
        await client.messages.create({
            from: 'whatsapp:+14155238886', // Twilio Sandbox
            to: 'whatsapp:+9773086768',   // YOUR NUMBER
            body:
`🚀 New Inquiry - Celeste IT

👤 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone || 'N/A'}
🛠 Service: ${service || 'N/A'}

💬 Message:
${message}`
        });

        res.status(200).json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
}
