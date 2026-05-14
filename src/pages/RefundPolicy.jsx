import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-primary mb-6">Refund Policy</h1>
                <p className="text-gray-600 mb-4">Last updated: December 2025</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">1. Overview</h2>
                        <p>We want you to be satisfied with your experience. If you are not completely satisfied with a purchase, we are here to help.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">2. Eligibility for Refunds</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Requests must be made within 7 days of purchase.</li>
                            <li>Services must not have been fully consumed or utilized.</li>
                            <li>Proof of purchase is required.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">3. Processing Time</h2>
                        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. Refunds are processed within 5-10 business days.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">4. Contact Us</h2>
                        <p>If you have any questions about our Refund Policy, please contact us at refunds@madventure.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
