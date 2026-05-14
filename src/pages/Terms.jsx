import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-primary mb-6">Terms & Conditions</h1>
                <p className="text-gray-600 mb-4">Last updated: December 2025</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing or using Madventure, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">2. User Accounts</h2>
                        <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">3. Content</h2>
                        <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">4. Termination</h2>
                        <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
