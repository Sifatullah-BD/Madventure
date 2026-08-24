import { Compass, Map, Tent, Users, ShoppingBag } from 'lucide-react';

export const getMegaMenuData = (language) => [
    {
        id: 'explore',
        title: language === 'bn' ? 'অন্বেষণ (Explore)' : 'Explore',
        icon: Compass,
        sections: [
            {
                title: language === 'bn' ? 'বাংলাদেশ অন্বেষণ' : 'Explore Bangladesh',
                items: [
                    { label: language === 'bn' ? 'বিভাগসমূহ' : 'Divisions', path: '/destinations?type=division' },
                    { label: language === 'bn' ? 'জেলাসমূহ' : 'Districts', path: '/destinations?type=district' },
                    { label: language === 'bn' ? 'দর্শনীয় স্থান' : 'Tourist Spots', path: '/destinations' },
                    { label: language === 'bn' ? 'অচেনা সৌন্দর্য' : 'Hidden Gems', path: '/explore?q=hidden-gems' },
                ]
            },
            {
                title: language === 'bn' ? 'আবিষ্কার করুন' : 'Discover',
                items: [
                    { label: language === 'bn' ? 'সমুদ্রসৈকত' : 'Beaches', path: '/explore?q=beaches' },
                    { label: language === 'bn' ? 'পাহাড়' : 'Mountains', path: '/explore?q=mountains' },
                    { label: language === 'bn' ? 'নদী ও হৃদ' : 'Rivers & Lakes', path: '/explore?q=rivers' },
                    { label: language === 'bn' ? 'ঐতিহাসিক স্থান' : 'Historical Places', path: '/explore?q=history' },
                    { label: language === 'bn' ? 'প্রকৃতি ও বন্যপ্রাণী' : 'Nature & Wildlife', path: '/explore?q=nature' },
                ]
            },
            {
                title: language === 'bn' ? 'ভিডিও' : 'Videos',
                items: [
                    { label: language === 'bn' ? 'ডেসটিনেশন ভিডিও' : 'Destination Videos', path: '/videos' },
                    { label: language === 'bn' ? 'ট্রাভেল রিলস' : 'Travel Reels', path: '/videos?type=reels' },
                    { label: language === 'bn' ? 'অ্যাডভেঞ্চার ভিডিও' : 'Adventure Videos', path: '/videos?type=adventure' },
                ]
            }
        ]
    },
    {
        id: 'plan_book',
        title: language === 'bn' ? 'প্ল্যান ও বুক' : 'Plan & Book',
        icon: Map,
        sections: [
            {
                title: language === 'bn' ? 'প্ল্যান (PLAN)' : 'PLAN',
                items: [
                    { label: language === 'bn' ? 'ট্রিপ প্ল্যানার' : 'Trip Planner', path: '/planner' },
                    { label: language === 'bn' ? 'আমার প্ল্যান' : 'My Plans', path: '/profile?tab=plans' },
                    { label: language === 'bn' ? 'সেভ করা ট্রিপ' : 'Saved Trips', path: '/profile?tab=wishlist' },
                ]
            },
            {
                title: language === 'bn' ? 'ট্যুরস (TOURS)' : 'TOURS',
                items: [
                    { label: language === 'bn' ? 'রেডি ট্যুর প্ল্যান' : 'Ready Tour Plans', path: '/tour-plans' },
                    { label: language === 'bn' ? 'কাস্টমাইজ ট্যুর' : 'Customize a Tour', path: '/planner' },
                ]
            },
            {
                title: language === 'bn' ? 'বুক (BOOK)' : 'BOOK',
                items: [
                    { label: language === 'bn' ? 'বাস টিকিট' : 'Bus Tickets', path: '/tickets?type=bus' },
                    { label: language === 'bn' ? 'ট্রেন টিকিট' : 'Train Tickets', path: '/tickets?type=train' },
                    { label: language === 'bn' ? 'ফ্লাইট টিকিট' : 'Flight Tickets', path: '/tickets?type=flight' },
                    { label: language === 'bn' ? 'লঞ্চ টিকিট' : 'Boat Tickets', path: '/tickets?type=boat' },
                ]
            }
        ]
    },
    {
        id: 'adventures',
        title: language === 'bn' ? 'অ্যাডভেঞ্চার' : 'Adventures',
        icon: Tent,
        sections: [
            {
                title: language === 'bn' ? 'ক্যাটাগরি' : 'Categories',
                items: [
                    { label: language === 'bn' ? 'অ্যাডভেঞ্চার ট্রিপ' : 'Adventure Trips', path: '/adventures' },
                    { label: language === 'bn' ? 'স্টুডেন্ট ট্যুর' : 'Student Tours', path: '/student-tours' },
                    { label: language === 'bn' ? 'গ্রুপ ট্যুর' : 'Group Tours', path: '/adventures?type=group' },
                    { label: language === 'bn' ? 'ফ্যামিলি ট্রিপ' : 'Family Trips', path: '/adventures?type=family' },
                    { label: language === 'bn' ? 'ক্যাম্পিং' : 'Camping', path: '/adventures?type=camping' },
                    { label: language === 'bn' ? 'হাইকিং এবং ট্রেকিং' : 'Hiking & Trekking', path: '/adventures?type=hiking' },
                    { label: language === 'bn' ? 'ওয়াটার অ্যাডভেঞ্চার' : 'Water Adventures', path: '/adventures?type=water' },
                    { label: language === 'bn' ? 'অভিজ্ঞতা (Experiences)' : 'Experiences', path: '/adventures?type=experience' },
                ]
            }
        ]
    },
    {
        id: 'community',
        title: language === 'bn' ? 'কমিউনিটি' : 'Community',
        icon: Users,
        sections: [
            {
                title: language === 'bn' ? 'কমিউনিটি' : 'Community',
                items: [
                    { label: language === 'bn' ? 'ট্রাভেল কমিউনিটি' : 'Travel Community', path: '/community' },
                    { label: language === 'bn' ? 'ট্রাভেল স্টোরি' : 'Travel Stories', path: '/blog' },
                    { label: language === 'bn' ? 'কমিউনিটি ভিডিও' : 'Community Videos', path: '/community/videos' },
                    { label: language === 'bn' ? 'ট্রাভেল পোস্ট' : 'Travel Posts', path: '/community?tab=posts' },
                    { label: language === 'bn' ? 'গ্রুপসমূহ' : 'Groups', path: '/community?tab=groups' },
                    { label: language === 'bn' ? 'আলোচনা' : 'Discussions', path: '/community?tab=discussions' },
                    { label: language === 'bn' ? 'ইভেন্ট' : 'Events', path: '/community?tab=events' },
                    { label: language === 'bn' ? 'ট্রাভেলার্স' : 'Travelers', path: '/community?tab=members' },
                ]
            }
        ]
    },
    {
        id: 'services',
        title: language === 'bn' ? 'সার্ভিসেস' : 'Services',
        icon: ShoppingBag,
        sections: [
            {
                title: language === 'bn' ? 'ভ্রমণ সেবা' : 'Travel Services',
                items: [
                    { label: language === 'bn' ? 'শপ' : 'Shop', path: '/shop' },
                    { label: language === 'bn' ? 'হোটেল এবং রিসোর্ট' : 'Hotels & Stays', path: '/services/hotels' },
                    { label: language === 'bn' ? 'রেস্টুরেন্ট' : 'Restaurants', path: '/services/restaurants' },
                    { label: language === 'bn' ? 'কার রেন্টাল' : 'Car Rental', path: '/services/car-rental' },
                    { label: language === 'bn' ? 'ট্রান্সপোর্ট' : 'Transport', path: '/services/transport' },
                    { label: language === 'bn' ? 'লোকাল গাইড' : 'Local Guides', path: '/services/guides' },
                    { label: language === 'bn' ? 'গাড়ির মেকানিক' : 'Vehicle Help', path: '/services/mechanic' },
                    { label: language === 'bn' ? 'জরুরি সেবা ও ফার্মেসি' : 'Emergency Help', path: '/services/emergency' },
                ]
            },
            {
                title: language === 'bn' ? 'বিজনেস' : 'Business',
                items: [
                    { label: language === 'bn' ? 'পার্টনার হোন' : 'Partner with Us', path: '/partner' },
                ]
            }
        ]
    }
];
