import { supabase } from '../../../../../lib/supabaseClient';
import { successResponse, errorResponse } from '../../../../../utils/apiResponse';
import { checkAdminAuth, logAdminAction } from '../../../../../lib/adminAuth';
import { convertToCSV } from '../../../../../utils/csvExport';
import { sendEmail } from '../../../../../utils/emailSender';

export default async function handler(req, res) {
    const auth = await checkAdminAuth(req);
    if (!auth.isAdmin) {
        return res ? res.status(auth.error.status).json(auth.error) : auth.error;
    }

    if (req.method !== 'POST') {
        return res ? res.status(405).json(errorResponse('Method Not Allowed')) : errorResponse('Method Not Allowed', 405);
    }

    try {
        const body = req.body || await req.json();
        const { reportType = 'users', targetEmail = auth.user.email } = body;

        let dataToExport = [];
        let fileName = '';

        if (reportType === 'users') {
            const { data } = await supabase.from('user_profiles').select('id, full_name, email, role, status, created_at');
            dataToExport = data || [];
            fileName = `users_report_${new Date().toISOString().split('T')[0]}.csv`;
        } else if (reportType === 'bookings') {
            const { data } = await supabase.from('bookings').select('id, user_id, tour_id, status, total_amount, created_at');
            dataToExport = data || [];
            fileName = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
        } else {
            return res ? res.status(400).json(errorResponse('Invalid reportType')) : errorResponse('Invalid reportType');
        }

        // Generate CSV
        const csvString = convertToCSV(dataToExport);

        // Send Email with CSV Attachment
        const emailResult = await sendEmail({
            to: targetEmail,
            subject: `Admin Report: ${reportType.toUpperCase()}`,
            body: `<p>Hello Admin,</p><p>Please find the requested <b>${reportType}</b> report attached.</p>`,
            attachments: [
                {
                    content: csvString,
                    filename: fileName,
                    type: 'text/csv'
                }
            ]
        });

        // Log Action
        await logAdminAction(auth.user.id, 'EXPORT_REPORT', reportType, null, { targetEmail, success: emailResult.success });

        if (!emailResult.success) {
            return res ? res.status(500).json(errorResponse(`Report generated, but email failed: ${emailResult.error}`)) : errorResponse(`Email failed: ${emailResult.error}`);
        }

        return res ? res.status(200).json(successResponse({ message: `Report sent successfully to ${targetEmail}` })) : successResponse({ message: `Report sent to ${targetEmail}` });
    } catch (err) {
        return res ? res.status(500).json(errorResponse(err.message)) : errorResponse(err.message);
    }
}
