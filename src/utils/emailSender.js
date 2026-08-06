/**
 * Utility wrapper for sending emails (e.g. using SendGrid or mock).
 * For development/mock purposes, it just logs to console unless an API key is provided.
 */
export const sendEmail = async ({ to, subject, body, attachments = [] }) => {
    const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;

    if (!SENDGRID_API_KEY) {
        console.warn('⚠️ No SendGrid API Key found. Mocking email send.');
        console.log(`\n--- MOCK EMAIL ---
To: ${to}
Subject: ${subject}
Body: ${body}
Attachments: ${attachments.length} files
------------------\n`);
        return { success: true, message: 'Mock email sent successfully.' };
    }

    try {
        // SendGrid API Implementation
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: 'noreply@madventure.com', name: 'Madventure System' }, // Ensure this sender is verified in SendGrid
                subject,
                content: [{ type: 'text/html', value: body }],
                attachments: attachments.map(att => ({
                    content: btoa(unescape(encodeURIComponent(att.content))), // Base64 encode
                    filename: att.filename,
                    type: att.type || 'text/csv',
                    disposition: 'attachment'
                }))
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors?.[0]?.message || 'SendGrid API Error');
        }

        return { success: true };
    } catch (error) {
        console.error('Email Send Error:', error);
        return { success: false, error: error.message };
    }
};
