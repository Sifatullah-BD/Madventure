import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { marketplaceService } from '../marketplaceService';

const DISTRICTS = ['Cox\'s Bazar', 'Sylhet', 'Bandarban'];

const MarketplaceHome = () => {
  const [counts, setCounts] = useState({ guide: 0, transport: 0, food: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      setLoading(true);
      try {
        const [guides, transport, food] = await Promise.all([
          marketplaceService.getVendors('guide'),
          marketplaceService.getVendors('transport'),
          marketplaceService.getVendors('food')
        ]);

        setCounts({
          guide: guides.length,
          transport: transport.length,
          food: food.length
        });
      } catch (error) {
        console.error('Marketplace load failed', error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <SEO title="Marketplace | Madventure" description="Local guide, transport and food services across Bangladesh." />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-white rounded-[2rem] shadow-lg p-10 mb-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-bold">Madventure Local Marketplace</p>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">Guide, Transport & Food — সব এক প্ল্যাটফর্মে</h1>
              <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-2xl">
                বাংলাদেশের ভ্রমণকারীদের জন্য সেরা লোকাল সার্ভিস প্ল্যাটফর্ম। গাইড বুক করুন, রাইড ঠিক করুন, এবং স্থানীয় খাবার অর্ডার করুন — সব একই জায়গায়।
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/marketplace/guides" className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800 transition">
                  Guide দেখুন
                </Link>
                <Link to="/marketplace/food" className="inline-flex items-center justify-center rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition">
                  Food দেখুন
                </Link>
                <Link to="/marketplace/register" className="inline-flex items-center justify-center rounded-full bg-white text-emerald-700 border border-emerald-700 px-6 py-3 text-sm font-semibold hover:bg-emerald-50 transition">
                  Vendor হিসেবে যোগ দিন
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl bg-emerald-800 p-6 text-white shadow-md">
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Trusted vendors</p>
                <p className="mt-4 text-4xl font-bold">{loading ? '—' : counts.guide}</p>
                <p className="mt-2 text-sm text-emerald-100">Guide providers</p>
              </div>
              <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Transport options</p>
                <p className="mt-4 text-4xl font-bold">{loading ? '—' : counts.transport}</p>
                <p className="mt-2 text-sm text-gray-500">Vehicles available</p>
              </div>
              <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Food partners</p>
                <p className="mt-4 text-4xl font-bold">{loading ? '—' : counts.food}</p>
                <p className="mt-2 text-sm text-gray-500">Menu items ready</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">সার্ভিস টাইপ</h2>
            <div className="space-y-4">
              <Link to="/marketplace/guides" className="block rounded-2xl bg-emerald-50 p-4 hover:bg-emerald-100 transition">
                <p className="font-semibold text-gray-900">🧭 Guide</p>
                <p className="text-sm text-gray-600 mt-1">স্থানীয় গাইড বুক করতে সাবেক্টেক্ট অনুযায়ী খুঁজুন.</p>
              </Link>
              <Link to="/marketplace/transport" className="block rounded-2xl bg-emerald-50 p-4 hover:bg-emerald-100 transition">
                <p className="font-semibold text-gray-900">🚌 Transport</p>
                <p className="text-sm text-gray-600 mt-1">কোনো রাইড, ফুল ডে, বা রাউন্ড ট্রিপের জন্য যানবাহন চয়ন করুন.</p>
              </Link>
              <Link to="/marketplace/food" className="block rounded-2xl bg-emerald-50 p-4 hover:bg-emerald-100 transition">
                <p className="font-semibold text-gray-900">🍽️ Food</p>
                <p className="text-sm text-gray-600 mt-1">সীমান্তীয় ও স্থানীয় খাবারের জন্য রেস্টুরেন্ট দেখুন.</p>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">District Filter</h2>
            <div className="flex flex-wrap gap-3">
              {DISTRICTS.map((district) => (
                <span key={district} className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">{district}</span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Services</h2>
            <div className="h-60 rounded-3xl bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
              Interactive map placeholder
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarketplaceHome;
