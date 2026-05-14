import React, { useState, useEffect } from 'react';
import { DISTRICTS } from '../../data/madventure-data';
import { Calculator, MapPin, Calendar, Users, Home, Bus, AlertTriangle, Lightbulb } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const ACCOM_TYPES = [
  { id: 'budget', label: 'বাজেট', range: '৳৮০০-২০০০', basePrice: 1500 },
  { id: 'mid', label: 'মধ্যম', range: '৳২০০০-৫০০০', basePrice: 3500 },
  { id: 'premium', label: 'প্রিমিয়াম', range: '৳৫০০০+', basePrice: 8000 }
];

const TRANSPORT_TYPES = [
  { id: 'bus', label: 'বাস', basePrice: 1000 },
  { id: 'train', label: 'ট্রেন', basePrice: 800 },
  { id: 'plane', label: 'বিমান', basePrice: 4500 },
  { id: 'car', label: 'নিজস্ব গাড়ি', basePrice: 2000 }
];

const BudgetCalculator = () => {
  const [formData, setFormData] = useState({
    destinationId: '',
    startDate: '',
    duration: 2, // nights
    groupSize: 2,
    accomType: 'budget',
    transportType: 'bus'
  });

  const [result, setResult] = useState(null);
  const [warnings, setWarnings] = useState([]);

  // Auto-calculate on any change
  useEffect(() => {
    if (!formData.destinationId || !formData.startDate) {
      setResult(null);
      setWarnings([]);
      return;
    }

    calculateBudget();
  }, [formData]);

  const calculateBudget = () => {
    const district = DISTRICTS.find(d => d.id === formData.destinationId);
    let newWarnings = [];

    // Date Logic (Peak vs Off-peak)
    const date = new Date(formData.startDate);
    const month = date.getMonth(); // 0 is Jan, 11 is Dec
    const isPeakSeason = (month === 11 || month === 0);
    const peakMultiplier = isPeakSeason ? 1.3 : 1.0;

    if (isPeakSeason) {
      newWarnings.push("পিক সিজনে (ডিসেম্বর-জানুয়ারি) দাম ৩০% বেশি হতে পারে।");
    }

    // Determine Rooms needed (assume 2 per room max)
    const roomsNeeded = Math.ceil(formData.groupSize / 2);

    // Costs
    const accomPrice = ACCOM_TYPES.find(a => a.id === formData.accomType).basePrice * peakMultiplier;
    const totalAccom = accomPrice * formData.duration * roomsNeeded;

    // Transport (round trip)
    const transportPrice = TRANSPORT_TYPES.find(t => t.id === formData.transportType).basePrice;
    let totalTransport = transportPrice * formData.groupSize * 2;
    if (formData.transportType === 'car') {
      totalTransport = 5000 + (formData.groupSize * 500); // Fixed base + per person variable for car
    }

    // Food (per day per person depending on accom style)
    const dailyFoodMap = { budget: 300, mid: 600, premium: 1200 };
    const totalFood = dailyFoodMap[formData.accomType] * (formData.duration + 1) * formData.groupSize * peakMultiplier;

    // Activities (estimation)
    const dailyActivitiesMap = { budget: 200, mid: 500, premium: 1000 };
    const totalActivities = dailyActivitiesMap[formData.accomType] * formData.duration * formData.groupSize;

    const subTotal = totalAccom + totalTransport + totalFood + totalActivities;
    const misc = subTotal * 0.10; // 10% buffer
    const grandTotal = subTotal + misc;

    // Warn if Cox's Bazar and short duration and high budget
    if (formData.destinationId === 'cox-bazar' && formData.duration === 1) {
      newWarnings.push("কক্সবাজারে ১ রাতের ট্যুর বেশ ক্লান্তিকর। অন্তত ২ রাত বিবেচনা করুন।");
    }
    
    // Check if total suggests an alternative
    if (formData.accomType === 'premium' && grandTotal > 50000) {
      newWarnings.push("আপনার রয়্যাল বাজেটে চাইলে দেশের বাইরে বা স্পেশাল লাক্সারি রিসোর্ট প্যাকেজও দেখতে পারেন!");
    }

    setWarnings(newWarnings);

    setResult({
      total: grandTotal,
      perPerson: grandTotal / formData.groupSize,
      breakdown: [
        { name: 'যাতায়াত', value: totalTransport, color: '#f97316' },
        { name: 'হোটেল', value: totalAccom, color: '#0ea5e9' },
        { name: 'খাবার', value: totalFood, color: '#10b981' },
        { name: 'অ্যাক্টিভিটি', value: totalActivities, color: '#8b5cf6' },
        { name: 'অন্যান্য (১০%)', value: misc, color: '#f43f5e' }
      ]
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-5xl mx-auto my-8">
      <div className="flex items-center gap-2 mb-8 text-secondary">
        <Calculator size={28} />
        <h2 className="text-2xl font-bold">স্মার্ট বাজেট ক্যালকুলেটর</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Column */}
        <div className="space-y-6">
          <div>
            <label className="block font-bold text-gray-800 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-primary"/> ১. গন্তব্য
            </label>
            <select 
              className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-primary bg-gray-50 outline-none font-bold"
              value={formData.destinationId}
              onChange={e => setFormData({...formData, destinationId: e.target.value})}
            >
              <option value="">কোথায় যাবেন?</option>
              {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-primary"/> ২. তারিখ
              </label>
              <input 
                type="date" 
                className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-primary bg-gray-50 outline-none font-bold"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-2">৩. কত রাত? ({formData.duration})</label>
              <input 
                type="range" min="1" max="14" 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users size={16} className="text-primary"/> ৪. লোকসংখ্যা ({formData.groupSize} জন)
            </label>
            <input 
              type="range" min="1" max="20" 
              value={formData.groupSize}
              onChange={e => setFormData({...formData, groupSize: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Home size={16} className="text-primary"/> ৫. হোটেলের ধরন
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ACCOM_TYPES.map(a => (
               <button 
                key={a.id}
                onClick={() => setFormData({...formData, accomType: a.id})}
                className={`p-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${formData.accomType === a.id ? 'border-primary bg-green-50 text-primary' : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600'}`}
               >
                 {a.label}<br/><span className="text-[10px] font-normal opacity-70">{a.range}</span>
               </button> 
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Bus size={16} className="text-primary"/> ৬. যাতায়াত মাধ্যম
            </label>
            <div className="flex flex-wrap gap-3">
              {TRANSPORT_TYPES.map(t => (
               <button 
                key={t.id}
                onClick={() => setFormData({...formData, transportType: t.id})}
                className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-colors ${formData.transportType === t.id ? 'border-secondary bg-orange-50 text-secondary' : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600'}`}
               >
                 {t.label}
               </button> 
              ))}
            </div>
          </div>

        </div>

        {/* Result Column */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full flex flex-col">
          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <Calculator size={48} className="mb-4 text-gray-400" />
              <p className="font-bold text-gray-600 text-lg">গন্তব্য ও তারিখ নির্বাচন করুন</p>
              <p className="text-sm">হিসাব দেখতে তথ্য পূরণ করুন</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <p className="text-gray-500 font-bold mb-1">মোট সম্ভাব্য খরচ</p>
                <h3 className="text-4xl font-bold text-[#1B5E20]">৳{Math.round(result.total).toLocaleString()}</h3>
                <p className="text-sm text-secondary font-bold mt-2 bg-orange-100 inline-block px-3 py-1 rounded-full">
                  মাথাপিছু: ৳{Math.round(result.perPerson).toLocaleString()}
                </p>
              </div>

              {warnings.length > 0 && (
                <div className="mb-6 space-y-3">
                  {warnings.map((w, i) => (
                    <div key={i} className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm flex gap-2 items-start">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={result.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {result.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `৳${Math.round(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Suggestions */}
              {result.total > 20000 && formData.destinationId === 'sundarbans' && (
                <div className="mt-auto bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm flex gap-3 items-start text-blue-800">
                  <Lightbulb size={20} className="shrink-0" />
                  <div>
                    <span className="font-bold block mb-1">খরচ কমানোর টিপস:</span>
                    সুন্দরবনে আলাদা না গিয়ে এজেন্সির প্যাকেজ নিলে খরচ প্রায় ১৫-২০% কম পড়তে পারে।
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
