import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
                <p className="text-gray-600 mb-4">Last updated: December 2025</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, update your profile, or use our services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, including to personalize your experience and provide customer support.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">3. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access or disclosure.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">4. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@madventure.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
