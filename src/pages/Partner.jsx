import React, { useRef } from 'react';
import { Briefcase, CheckCircle, TrendingUp, Users, Globe, ArrowRight, Upload, User, FileText } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { uploadImages } from '../api/storage';
import { createPartnerRequest } from '../api/community';
import { useToast } from '../components/ui/Toast';

const Partner = () => {
    const [submitted, setSubmitted] = React.useState(false);
    const [businessName, setBusinessName] = React.useState('');
    const [businessType, setBusinessType] = React.useState('Hotel / Resort');
    const [location, setLocation] = React.useState('');
    const [ownerName, setOwnerName] = React.useState('');
    const [nid, setNid] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const fileRef = useRef(null);
    const toast = useToast();

    const validatePhone = (value) => {
        const digits = value.replace(/\D/g, '');
        return (digits.length === 11 && digits.startsWith('01')) || (digits.length === 13 && digits.startsWith('8801'));
    };

    const validateNid = (value) => {
        const digits = value.replace(/\D/g, '');
        return [10, 13, 17].includes(digits.length);
    };

    const handleFileClick = () => fileRef.current && fileRef.current.click();

    const handleFileChange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) {
            toast.error('File too large. Max 5MB allowed.');
            return;
        }
        const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowed.includes(f.type)) {
            toast.error('Invalid file type. Use PDF, JPG or PNG.');
            return;
        }
        setFile(f);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhone(phone)) return toast.error('Invalid phone number. Use +8801XXXXXXXXX or 01XXXXXXXXX');
        if (!validateNid(nid)) return toast.error('Invalid NID. Provide 10, 13 or 17 digit national ID');

        setUploading(true);
        try {
            let docUrls = [];
            if (file) {
                const { data, error } = await uploadImages('partner-docs', [file]);
                if (error) throw error;
                docUrls = data || [];
            }

            const payload = {
                business_name: businessName,
                business_type: businessType,
                location,
                owner_name: ownerName,
                nid,
                phone,
                email,
                documents: docUrls,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await createPartnerRequest(payload);
            if (error) throw error;

            toast.success('Application submitted successfully');
            setSubmitted(true);
            // Reset form
            setBusinessName(''); setBusinessType('Hotel / Resort'); setLocation(''); setOwnerName(''); setNid(''); setPhone(''); setEmail(''); setFile(null);
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to submit application');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Grow Your Business with Madventure"
                subtitle="Join thousands of hotels, tour guides, and rental services growing their revenue with us."
            />
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Benefits */}
                    <div className="space-y-6">

                        <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Free Marketing</h3>
                                <p className="text-gray-600">Showcase your business to a global audience without spending a dime on ads.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Increase Revenue</h3>
                                <p className="text-gray-600">Get more bookings and customers directly through our platform.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Business Dashboard</h3>
                                <p className="text-gray-600">Manage bookings, track analytics, and respond to reviews easily.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Registration Form */}
                    <div id="register-form" className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        {!submitted ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Briefcase className="text-primary" /> Register Your Business
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="e.g. Sea View Hotel" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                            <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                                <option>Hotel / Resort</option>
                                                <option>Tour Guide</option>
                                                <option>Rent-a-Car</option>
                                                <option>Restaurant</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="City / Area" />
                                        </div>
                                    </div>

                                    {/* Owner Info Section */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <User size={16} /> Owner Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                                                <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Full Name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">NID Number</label>
                                                <input value={nid} onChange={(e) => setNid(e.target.value)} type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="National ID" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="+880..." />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="business@example.com" />
                                    </div>

                                    {/* Trade License Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Trade License / Business Proof</label>
                                        <input ref={fileRef} onChange={handleFileChange} type="file" accept=".pdf,image/*" className="hidden" />
                                        <div onClick={handleFileClick} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50">
                                            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                            {file ? (
                                                <p className="text-sm text-gray-700 font-medium">Selected: {file.name}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-600 font-medium">Click to upload document</p>
                                                    <p className="text-xs text-gray-400">PDF, JPG or PNG (Max 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button disabled={uploading} type="submit" className="w-full bg-primary disabled:opacity-60 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                                        {uploading ? 'Submitting…' : 'Submit Application'} <ArrowRight size={20} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 animate-bounce">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Application Received!</h2>
                                <p className="text-gray-600 mb-8">Thank you for your interest. Our team will review your application and contact you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline">
                                    Submit another application
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partner;
