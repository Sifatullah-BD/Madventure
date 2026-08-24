import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const VENDOR_TYPES = [
  { id: 'guide', label: 'লোকাল গাইড', icon: '🧭', desc: 'ট্যুরিস্টদের গাইড করুন' },
  { id: 'transport', label: 'ট্রান্সপোর্ট', icon: '🚌', desc: 'যানবাহন ভাড়া দিন' },
  { id: 'food', label: 'খাবার', icon: '🍽️', desc: 'রেস্তোরাঁ বা ফুড সার্ভিস' },
  { id: 'hotel', label: 'হোটেল / রিসোর্ট', icon: '🏨', desc: 'থাকার জায়গা তালিকাভুক্ত করুন' },
  { id: 'rental', label: 'কার রেন্টাল', icon: '🚗', desc: 'গাড়ি ভাড়া দিন' },
  { id: 'mechanic', label: 'ভেহিকেল হেল্প', icon: '🔧', desc: 'রাস্তায় গাড়ির সহায়তা দিন' },
  { id: 'emergency', label: 'জরুরি সেবা', icon: '🆘', desc: 'ভ্রমণকারীদের জরুরি সহায়তা দিন' },
  { id: 'other', label: 'অন্যান্য সেবা', icon: '➕', desc: 'নিজের সেবার ধরন যোগ করুন' },
];

const VEHICLE_TYPES = ['CNG', 'Car', 'Microbus', 'Bus', 'Boat', 'Bike'];
const LANGUAGES = ['বাংলা', 'English', 'Hindi', 'Arabic'];
const SPECIALIZATIONS = ['ট্রেকিং', 'ফটোগ্রাফি', 'ইতিহাস', 'প্রকৃতি', 'অ্যাডভেঞ্চার'];
const DAYS = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];

export default function VendorRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    vendor_type: '',
    business_name: '',
    description: '',
    phone: '',
    whatsapp_number: '',
    address: '',
    // Guide specific
    languages: [],
    specializations: [],
    experience_years: '',
    daily_rate: '',
    half_day_rate: '',
    available_days: [],
    // Transport specific
    vehicle_type: '',
    vehicle_model: '',
    capacity: '',
    ac_available: false,
    base_price_per_day: '',
    base_price_per_km: '',
    // Food specific
    opening_hours: '',
    food_categories: '',
    custom_vendor_type: '',
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleArray = (key, value) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));
  };

  const handleSubmit = async () => {
    if (form.vendor_type === 'other' && !form.custom_vendor_type.trim()) {
      return;
    }
    setLoading(true);
    try {
      const slug = form.business_name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

      const { data: vendor, error } = await supabase
        .from('vendors')
        .insert({
          vendor_type: form.vendor_type === 'other' ? form.custom_vendor_type.trim() : form.vendor_type,
          business_name: form.business_name,
          slug: `${slug}-${Date.now()}`,
          description: form.description,
          phone: form.phone,
          whatsapp_number: form.whatsapp_number,
          address: form.address,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      if (form.vendor_type === 'guide') {
        await supabase.from('guide_profiles').insert({
          vendor_id: vendor.id,
          languages: form.languages,
          specializations: form.specializations,
          experience_years: parseInt(form.experience_years, 10) || 0,
          daily_rate: parseFloat(form.daily_rate) || 0,
          half_day_rate: parseFloat(form.half_day_rate) || 0,
          available_days: form.available_days,
        });
      }

      if (form.vendor_type === 'transport') {
        await supabase.from('transport_vehicles').insert({
          vendor_id: vendor.id,
          vehicle_type: form.vehicle_type,
          vehicle_model: form.vehicle_model,
          capacity: parseInt(form.capacity, 10) || 0,
          ac_available: form.ac_available,
          base_price_per_day: parseFloat(form.base_price_per_day) || 0,
          base_price_per_km: parseFloat(form.base_price_per_km) || 0,
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Vendor registration failed', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">আবেদন সফল!</h2>
          <p className="text-gray-600 mb-6">
            আপনার আবেদন আমাদের টিম রিভিউ করবে। ২৪-৪৮ ঘণ্টার মধ্যে আপনার ফোনে যোগাযোগ করা হবে।
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-medium"
          >
            Marketplace দেখুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendor হিসেবে যোগ দিন</h1>
          <p className="text-gray-600 mt-2">লক্ষ লক্ষ ট্রাভেলারের কাছে আপনার সেবা পৌঁছে দিন</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`w-16 h-1 rounded ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6">আপনি কোন ধরনের সেবা দিতে চান?</h2>
              <div className="grid gap-4">
                {VENDOR_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => update('vendor_type', type.id)}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl text-left transition-all ${
                      form.vendor_type === type.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-4xl">{type.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{type.label}</p>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </div>
                    {form.vendor_type === type.id && <span className="ml-auto text-green-600 text-xl">✓</span>}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.vendor_type}
                className="mt-6 w-full py-3 bg-green-600 text-white rounded-xl font-medium disabled:opacity-50"
              >
                পরের ধাপ →
              </button>
              {form.vendor_type === 'other' && (
                <input
                  value={form.custom_vendor_type}
                  onChange={(e) => update('custom_vendor_type', e.target.value)}
                  placeholder="আপনার সেবার ধরন লিখুন"
                  className="mt-3 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6">মূল তথ্য দিন</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ব্যবসার নাম *</label>
                  <input
                    type="text"
                    value={form.business_name}
                    onChange={(e) => update('business_name', e.target.value)}
                    placeholder="যেমন: রহিম গাইড সার্ভিস"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="আপনার সেবা সম্পর্কে সংক্ষেপে লিখুন..."
                    rows={3}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp নম্বর</label>
                    <input
                      type="tel"
                      value={form.whatsapp_number}
                      onChange={(e) => update('whatsapp_number', e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="এলাকা, জেলা"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {form.vendor_type === 'guide' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ভাষা</label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleArray('languages', lang)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                              form.languages.includes(lang)
                                ? 'bg-green-600 text-white border-green-600'
                                : 'border-gray-300 text-gray-600'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">বিশেষত্ব</label>
                      <div className="flex flex-wrap gap-2">
                        {SPECIALIZATIONS.map((spec) => (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => toggleArray('specializations', spec)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                              form.specializations.includes(spec)
                                ? 'bg-green-600 text-white border-green-600'
                                : 'border-gray-300 text-gray-600'
                            }`}
                          >
                            {spec}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">অভিজ্ঞতা (বছর)</label>
                        <input
                          type="number"
                          value={form.experience_years}
                          onChange={(e) => update('experience_years', e.target.value)}
                          className="w-full border rounded-xl px-3 py-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">সারাদিন (৳)</label>
                        <input
                          type="number"
                          value={form.daily_rate}
                          onChange={(e) => update('daily_rate', e.target.value)}
                          placeholder="১৫০০"
                          className="w-full border rounded-xl px-3 py-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">অর্ধদিন (৳)</label>
                        <input
                          type="number"
                          value={form.half_day_rate}
                          onChange={(e) => update('half_day_rate', e.target.value)}
                          placeholder="৮০০"
                          className="w-full border rounded-xl px-3 py-2.5 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">কার্যদিবস</label>
                      <div className="flex flex-wrap gap-2">
                        {DAYS.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleArray('available_days', day)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                              form.available_days.includes(day)
                                ? 'bg-green-600 text-white border-green-600'
                                : 'border-gray-300 text-gray-600'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {form.vendor_type === 'transport' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">যানবাহনের ধরন</label>
                        <select
                          value={form.vehicle_type}
                          onChange={(e) => update('vehicle_type', e.target.value)}
                          className="w-full border rounded-xl px-4 py-3 outline-none"
                        >
                          <option value="">বেছে নিন</option>
                          {VEHICLE_TYPES.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">মডেল</label>
                        <input
                          type="text"
                          value={form.vehicle_model}
                          onChange={(e) => update('vehicle_model', e.target.value)}
                          placeholder="Toyota Noah"
                          className="w-full border rounded-xl px-4 py-3 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ধারণক্ষমতা</label>
                        <input
                          type="number"
                          value={form.capacity}
                          onChange={(e) => update('capacity', e.target.value)}
                          placeholder="৮"
                          className="w-full border rounded-xl px-3 py-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">প্রতি কিমি (৳)</label>
                        <input
                          type="number"
                          value={form.base_price_per_km}
                          onChange={(e) => update('base_price_per_km', e.target.value)}
                          placeholder="২৫"
                          className="w-full border rounded-xl px-3 py-2.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">সারাদিন (৳)</label>
                        <input
                          type="number"
                          value={form.base_price_per_day}
                          onChange={(e) => update('base_price_per_day', e.target.value)}
                          placeholder="৩৫০০"
                          className="w-full border rounded-xl px-3 py-2.5 outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.ac_available}
                        onChange={(e) => update('ac_available', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">এসি আছে</span>
                    </label>
                  </>
                )}

                {form.vendor_type === 'food' && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">খোলার সময়</label>
                        <input
                          type="text"
                          value={form.opening_hours}
                          onChange={(e) => update('opening_hours', e.target.value)}
                          placeholder="১০:০০ AM - ১০:০০ PM"
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">খাবারের ধরন</label>
                        <input
                          type="text"
                          value={form.food_categories}
                          onChange={(e) => update('food_categories', e.target.value)}
                          placeholder="বাংলাদেশি, চাইনিজ, ফাস্ট ফুড"
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
                >
                  ← আগে
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!form.business_name || !form.phone}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  পরের ধাপ →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6">তথ্য যাচাই করুন</h2>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">ধরন</span>
                  <span className="font-medium">{VENDOR_TYPES.find((t) => t.id === form.vendor_type)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ব্যবসার নাম</span>
                  <span className="font-medium">{form.business_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ফোন</span>
                  <span className="font-medium">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ঠিকানা</span>
                  <span className="font-medium">{form.address}</span>
                </div>
                {form.vendor_type === 'guide' && form.daily_rate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">সারাদিনের রেট</span>
                    <span className="font-medium">৳{form.daily_rate}</span>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  ⚠️ আবেদন করার পর আমাদের টিম ২৪-৪৮ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
                >
                  ← আগে
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  {loading ? 'পাঠানো হচ্ছে...' : 'আবেদন করুন ✓'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
