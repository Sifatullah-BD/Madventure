import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { marketplaceService } from '../marketplaceService';

const VendorProfile = () => {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      try {
        const data = await marketplaceService.getVendorBySlug(slug);
        setVendor(data);
      } catch (error) {
        console.error('Failed to load vendor profile', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchVendor();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-gray-500">Loading vendor profile...</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="rounded-3xl bg-white p-12 border border-gray-200 shadow-sm text-center">
          <p className="text-xl font-semibold text-gray-900">Vendor found না</p>
          <p className="mt-3 text-gray-600">Please verify the link or go back to the marketplace.</p>
          <Link to="/marketplace" className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-white font-semibold hover:bg-emerald-800 transition">Marketplace এ ফিরে যান</Link>
        </div>
      </div>
    );
  }

  const profile = vendor.guide_profiles?.[0] || {};
  const vehicle = vendor.transport_vehicles?.[0] || {};
  const menuItems = vendor.food_menus || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <SEO title={`${vendor.business_name} | Vendor Profile`} description={vendor.description || 'Vendor profile from Madventure Marketplace.'} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <section className="rounded-[2rem] overflow-hidden bg-white shadow-lg">
          <div className="relative h-72 bg-gray-100">
            <img
              src={vendor.cover_image || '/marketplace-cover-placeholder.jpg'}
              alt={vendor.business_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">{vendor.vendor_type || 'Service'}</p>
                <h1 className="mt-3 text-4xl font-bold text-gray-900">{vendor.business_name}</h1>
                <p className="mt-4 text-gray-600 max-w-2xl">{vendor.description || 'Trusted local service provider in the Madventure marketplace.'}</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-6 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-800 font-semibold">Rating</p>
                <p className="mt-3 text-3xl font-bold text-emerald-900">{vendor.rating?.toFixed(1) ?? '0.0'}</p>
                <p className="mt-1 text-sm text-emerald-700">{vendor.total_reviews ?? 0} reviews</p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm uppercase tracking-[0.26em] text-gray-600 font-semibold">Location</p>
                <p className="mt-3 text-gray-900">{vendor.district_id || 'পরিচয় নেই'}</p>
                <p className="mt-2 text-sm text-gray-600">{vendor.address || 'Address not available yet.'}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm uppercase tracking-[0.26em] text-gray-600 font-semibold">Contact</p>
                <p className="mt-3 text-gray-900">{vendor.phone || 'N/A'}</p>
                <p className="mt-2 text-sm text-gray-600">WhatsApp: {vendor.whatsapp_number || 'N/A'}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm uppercase tracking-[0.26em] text-gray-600 font-semibold">Status</p>
                <p className="mt-3 text-gray-900 capitalize">{vendor.status || 'pending'}</p>
                <p className="mt-2 text-sm text-gray-600">{vendor.is_active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {vendor.vendor_type === 'guide' && (
            <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guide Profile</h2>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold">Languages:</span> {profile.languages?.join(', ') || 'বাংলা, English'}</p>
                <p><span className="font-semibold">Specializations:</span> {profile.specializations?.join(', ') || 'ট্রেকিং, ইকো ট্যুর'}</p>
                <p><span className="font-semibold">Experience:</span> {profile.experience_years ?? 5} বছর</p>
                <p><span className="font-semibold">Daily rate:</span> ৳{profile.daily_rate ?? '১,৫০০'}</p>
                <p><span className="font-semibold">Available days:</span> {profile.available_days?.join(', ') || 'Saturday, Sunday'}</p>
              </div>
            </div>
          )}

          {vendor.vendor_type === 'transport' && (
            <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Transport Vehicles</h2>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold">Vehicle type:</span> {vehicle.vehicle_type || 'Car'}</p>
                <p><span className="font-semibold">Model:</span> {vehicle.vehicle_model || 'Toyota Noah'}</p>
                <p><span className="font-semibold">Capacity:</span> {vehicle.capacity ?? 6} জন</p>
                <p><span className="font-semibold">Price per km:</span> ৳{vehicle.base_price_per_km ?? ২৫}</p>
                <p><span className="font-semibold">Available:</span> {vehicle.is_available ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}

          {vendor.vendor_type === 'food' && (
            <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Food Menu</h2>
              <div className="space-y-4 text-gray-700">
                {menuItems.length ? (
                  menuItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                      <p className="font-semibold text-gray-900">{item.item_name}</p>
                      <p className="text-sm text-gray-600">{item.category || 'Menu item'}</p>
                      <p className="mt-2 text-sm text-gray-800">৳{item.price}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Menu items not yet available.</p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Ready to book?</h2>
              <p className="mt-2 text-gray-600">Vendor booking, order placement এবং যোগাযোগ শুরু করতে নিচের বোতনে চাপুন।</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace" className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                Marketplace ফিরে যান
              </Link>
              <button type="button" className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition">
                বুকিং শুরু করুন
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VendorProfile;
