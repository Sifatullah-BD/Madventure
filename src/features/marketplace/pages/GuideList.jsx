import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import { marketplaceService } from '../marketplaceService';
import GuideCard from '../components/GuideCard';

const DISTRICTS = ['Cox\'s Bazar', 'Sylhet', 'Bandarban'];

const GuideList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const district = searchParams.get('district');
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const data = await marketplaceService.getVendors('guide', district);
        setGuides(data || []);
      } catch (error) {
        console.error('Failed to load guide listings', error);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [district]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <SEO title="Guides | Marketplace" description="Search and book trusted local guides across Bangladesh." />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">Guide Marketplace</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Top Local Guides</h1>
          <p className="mt-4 text-gray-600 max-w-2xl">সেরা গাইড খুঁজুন, তাদের প্রোফাইল দেখুন, এবং দ্রুত বুক করুন।</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          {DISTRICTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSearchParams(value ? { district: value } : {})}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${district === value ? 'bg-emerald-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition"
          >
            সব দেখুন
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-gray-500">Loading guides...</div>
          </div>
        ) : guides.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((vendor) => (
              <GuideCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-xl font-semibold text-gray-900">কোনো গাইড পাওয়া যায়নি</p>
            <p className="mt-3 text-gray-600">অনুগ্রহ করে অন্য কোনো জেলা বা সার্চ অপশন নির্বাচন করুন।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideList;
