import React, { useState, useRef } from 'react';
import { MapPin, Star, Phone, Mail, Globe, Facebook, Instagram, Twitter, CheckCircle, Calendar, Clock, DollarSign, ArrowRight, Heart, Share2, MessageCircle, Link as LinkIcon, Camera, X, Crop, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

const AgencyProfile = () => {
    const [activeTab, setActiveTab] = useState('packages');
    const [showShareModal, setShowShareModal] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [screenshotImage, setScreenshotImage] = useState(null);
    const profileRef = useRef(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShareModal(false);
        setShowToast('Link copied to clipboard!');
        setTimeout(() => setShowToast(null), 3000);
    };

    const handleScreenshot = async () => {
        setShowShareModal(false);
        setShowToast('Capturing...');

        try {
            const canvas = await html2canvas(profileRef.current, {
                useCORS: true,
                scale: 2, // Better quality
                logging: false,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight
            });

            const image = canvas.toDataURL('image/png');
            setScreenshotImage(image);
            setShowCropModal(true);
            setShowToast(null);
        } catch (error) {
            console.error("Screenshot failed:", error);
            setShowToast('Failed to capture screenshot');
        }
    };

    const downloadScreenshot = async () => {
        try {
            const croppedImage = await getCroppedImg(screenshotImage, croppedAreaPixels);
            const link = document.createElement('a');
            link.href = croppedImage;
            link.download = `agency-profile-${Date.now()}.png`;
            link.click();
            setShowCropModal(false);
            setShowToast('Screenshot downloaded!');
            setTimeout(() => setShowToast(null), 3000);
        } catch (e) {
            console.error(e);
            setShowToast('Failed to download');
        }
    };

    // Mock Data
    const agency = {
        name: "Green Leaf Travels",
        tagline: "Explore the world with nature's touch",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        banner: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        rating: 4.8,
        reviews: 124,
        location: "Gulshan 2, Dhaka, Bangladesh",
        yearsInService: 5,
        description: "Green Leaf Travels is a premier travel agency dedicated to providing eco-friendly and sustainable travel experiences. We specialize in nature treks, cultural tours, and relaxing beach getaways. Our team of experienced guides ensures your safety and enjoyment every step of the way.",
        contact: {
            phone: "+880 1712 345678",
            email: "info@greenleaf.com",
            website: "www.greenleaf.com",
            socials: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        }
    };

    const packages = [
        {
            id: 1,
            title: "Sajek Valley Retreat",
            image: "https://images.unsplash.com/photo-1628063737583-04dd77da9d8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: 5500,
            duration: "3 Days / 2 Nights",
            type: "Hill Station",
            rating: 4.9
        },
        {
            id: 2,
            title: "Cox's Bazar Beach Holiday",
            image: "https://images.unsplash.com/photo-1595304383796-6c9c61483562?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: 8000,
            duration: "4 Days / 3 Nights",
            type: "Beach",
            rating: 4.7
        },
        {
            id: 3,
            title: "Sylhet Tea Garden Tour",
            image: "https://images.unsplash.com/photo-1596627883637-234204221752?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            price: 4500,
            duration: "2 Days / 1 Night",
            type: "Nature",
            rating: 4.8
        }
    ];

    const reviews = [
        { id: 1, user: "Rahim Ahmed", rating: 5, date: "2 days ago", comment: "Excellent service! The guides were very knowledgeable and friendly." },
        { id: 2, user: "Fatima Begum", rating: 4, date: "1 week ago", comment: "Great trip, but the bus was a bit delayed. Otherwise perfect." }
    ];

    const similarAgencies = [
        { id: 1, name: "Travel X", rating: 4.5, image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
        { id: 2, name: "Wanderlust BD", rating: 4.7, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
        { id: 3, name: "Cloud 9 Tours", rating: 4.6, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" }
    ];

    return (
        <div ref={profileRef} className="min-h-screen bg-gray-50 font-sans">

            {/* Header / Banner Section */}
            <div className="relative h-[300px] md:h-[400px]">
                <img src={agency.banner} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-1 shadow-xl -mb-12 md:-mb-16 relative z-10">
                            <img src={agency.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="text-white flex-1 mb-2 md:mb-0">
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">{agency.name}</h1>
                            <p className="text-gray-300 text-lg mb-4">{agency.tagline}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                                <span className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/50 text-yellow-400 font-bold">
                                    <Star size={16} fill="currentColor" /> {agency.rating} ({agency.reviews} reviews)
                                </span>
                                <span className="flex items-center gap-1 text-gray-300">
                                    <MapPin size={16} /> {agency.location}
                                </span>
                                <span className="flex items-center gap-1 text-gray-300">
                                    <CheckCircle size={16} className="text-green-400" /> {agency.yearsInService} Years Service
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-4 md:mb-2">
                            <button className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20">
                                <Heart size={20} /> Follow
                            </button>
                            <button onClick={() => setShowShareModal(true)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors backdrop-blur-sm border border-white/20">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                        {['packages', 'about', 'reviews', 'gallery'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'packages' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                {packages.map(pkg => (
                                    <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                                <Star size={12} className="text-yellow-500" fill="currentColor" /> {pkg.rating}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{pkg.type}</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">{pkg.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {pkg.duration}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                                <div>
                                                    <span className="text-xs text-gray-400">Starting from</span>
                                                    <div className="text-lg font-bold text-gray-800">৳{pkg.price}</div>
                                                </div>
                                                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">About {agency.name}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">{agency.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase">Location</div>
                                            <div className="text-gray-800 font-medium">{agency.location}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase">Experience</div>
                                            <div className="text-gray-800 font-medium">{agency.yearsInService} Years in Business</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-4xl font-bold text-gray-800 mb-1">{agency.rating}</div>
                                        <div className="flex text-yellow-400 text-sm mb-1">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                        </div>
                                        <div className="text-sm text-gray-500">Based on {agency.reviews} reviews</div>
                                    </div>
                                    <button className="border-2 border-primary text-primary px-6 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                                        Write a Review
                                    </button>
                                </div>

                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                    {review.user[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{review.user}</h4>
                                                    <p className="text-xs text-gray-500">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                                {[1, 2, 3, 4, 5, 6].map(item => (
                                    <div key={item} className="aspect-square rounded-xl overflow-hidden bg-gray-200">
                                        <img
                                            src={`https://source.unsplash.com/random/800x800?travel,nature&sig=${item}`}
                                            alt="Gallery"
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">

                    {/* Contact Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Agency</h3>

                        <div className="space-y-4 mb-6">
                            <a href={`tel:${agency.contact.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <span className="font-medium">{agency.contact.phone}</span>
                            </a>
                            <a href={`mailto:${agency.contact.email}`} className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <span className="font-medium">{agency.contact.email}</span>
                            </a>
                            <a href={`https://${agency.contact.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    <Globe size={18} />
                                </div>
                                <span className="font-medium">{agency.contact.website}</span>
                            </a>
                        </div>

                        <div className="flex gap-2 justify-center mb-8">
                            <a href="#" className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="w-10 h-10 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center hover:bg-sky-600 hover:text-white transition-colors"><Twitter size={18} /></a>
                        </div>

                        <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                            <MessageCircle size={20} /> Send Inquiry
                        </button>
                    </div>

                    {/* Similar Agencies */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Similar Agencies</h3>
                        <div className="space-y-4">
                            {similarAgencies.map(agency => (
                                <div key={agency.id} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                                    <img src={agency.image} alt={agency.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{agency.name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                                            <Star size={10} fill="currentColor" /> {agency.rating}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                        <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Share Agency Profile</h3>

                        <div className="space-y-4">
                            <button onClick={handleCopyLink} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                        <LinkIcon size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-800">Copy Link</div>
                                        <div className="text-xs text-gray-500">Share profile URL</div>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button onClick={handleScreenshot} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                        <Camera size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-800">Screenshot</div>
                                        <div className="text-xs text-gray-500">Save profile as image</div>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Crop/Preview Modal */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center p-4 animate-fade-in">
                    <div className="w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Crop size={20} /> Preview Screenshot
                            </h3>
                            <button onClick={() => setShowCropModal(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden relative bg-black h-[60vh]">
                            {screenshotImage && (
                                <Cropper
                                    image={screenshotImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-800 bg-gray-900 flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-white text-sm">
                                <span>Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-24"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setShowCropModal(false)} className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-gray-800 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={downloadScreenshot} className="bg-primary text-white px-8 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20">
                                    <Download size={20} /> Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in z-50">
                    <CheckCircle className="text-green-400" size={24} />
                    <div>
                        <h4 className="font-bold">Success</h4>
                        <p className="text-xs text-gray-400">{showToast}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgencyProfile;
