import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const notificationService = {
    /**
     * Simulates sending a WhatsApp or SMS notification via a provider like SSL Wireless.
     * Logs the transaction to Supabase.
     */
    async sendWhatsAppNotification(phone, bookingId, amount) {
        const message = `🎉 Madventure: Your booking (ID: ${bookingId.split('-')[0]}) for BDT ${amount} is CONFIRMED! 
Have a safe trip! Need help? Reply to this message.`;

        console.log(`[SIMULATION] Sending WhatsApp to ${phone}...`);
        console.log(`[SIMULATION] Message: ${message}`);

        if (isSupabaseConfigured) {
            try {
                await supabase.from('notification_logs').insert({
                    booking_id: bookingId,
                    recipient_phone: phone,
                    notification_type: 'whatsapp',
                    message_content: message,
                    provider: 'simulation'
                });
            } catch (err) {
                console.error("Failed to log notification", err);
            }
        }

        return { success: true, message: 'Notification simulated successfully.' };
    },

    /**
     * Generates a direct WhatsApp link to send a manual message if the automated system fails.
     */
    generateDirectWhatsAppLink(phone, message) {
        // Ensure phone has country code (assuming BD +880)
        let formattedPhone = phone;
        if (phone.startsWith('01')) {
            formattedPhone = `88${phone}`;
        }
        return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    }
};
