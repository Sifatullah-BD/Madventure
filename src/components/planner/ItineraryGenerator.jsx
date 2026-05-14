import React, { useState, useEffect } from 'react';
import { DISTRICTS, getToursByDistrict, getHotelsByDistrict } from '../../data/madventure-data';
import { 
  MapPin, Calendar, Wallet, Users, Heart, Sparkles, Loader2, 
  ChevronDown, ChevronUp, Download, Share2, Sun, Sunset, Moon, 
  CheckCircle, ArrowRight, Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveItinerary } from '../../api/planner';
import { useAuth } from '../../hooks/useAuth';

const GROUP_TYPES = [
  { id: 'solo', label: 'সলো ট্রাভেলার', icon: Users, multiplier: 1 },
  { id: 'couple', label: 'দম্পতি', icon: Heart, multiplier: 2 },
  { id: 'family', label: 'পরিবার', icon: Users, multiplier: 4 },
  { id: 'friends', label: 'বন্ধুমহল', icon: Users, multiplier: 5 },
];

const INTERESTS = [
  { id: 'beach', label: 'সমুদ্র' },
  { id: 'mountain', label: 'পাহাড়' },
  { id: 'culture', label: 'ঐতিহ্য' },
  { id: 'food', label: 'খাবার' },
  { id: 'adventure', label: 'অ্যাডভেঞ্চার' }
];

const ItineraryGenerator = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destinationId: '',
    startDate: '',
    duration: 3,
    budget: 10000,
    groupType: 'couple',
    interests: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedPlan = localStorage.getItem('madventure-planner-v1');
    if (savedPlan) {
      const parsed = JSON.parse(savedPlan);
      if (parsed.result) {
        setFormData(parsed.formData);
        setResult(parsed.result);
        setStep(6);
      }
    }
  }, []);

  const toggleInterest = (id) => {
    setFormData(prev => {
      const current = prev.interests;
      if (current.includes(id)) return { ...prev, interests: current.filter(i => i !== id) };
      return { ...prev, interests: [...current, id] };
    });
  };

  const handleGenerate = () => {
    if (!formData.destinationId) return alert("গন্তব্য নির্বাচন করুন!");
    if (!formData.startDate) return alert("যাত্রার তারিখ দিন!");
    
    setIsGenerating(true);

    setTimeout(() => {
      const district = DISTRICTS.find(d => d.id === formData.destinationId);
      const tours = getToursByDistrict(formData.destinationId);
      const hotels = getHotelsByDistrict(formData.destinationId);

      const groupMult = GROUP_TYPES.find(g => g.id === formData.groupType).multiplier;
      const totalBudget = formData.budget * groupMult;

      const transportEst = (district?.howToGet?.bus?.cost || 1000) * groupMult * 2;
      const dailyFood = 500 * groupMult;
      const hotelPerNight = hotels.length > 0 ? hotels[0].pricePerNight.min : 2000;
      
      const totalFood = dailyFood * formData.duration;
      const totalHotel = hotelPerNight * Math.max(1, formData.duration - 1);
      const activitiesEst = totalBudget - (transportEst + totalFood + totalHotel);
      
      const days = [];
      for (let i = 1; i <= formData.duration; i++) {
        days.push({
          day: i,
          morning: i === 1 ? `যাত্রা শুরু ও ${district.name} পৌঁছানো` : `${district.highlights[0] || 'লোকাল সিনেরি'} ঘুরে দেখা`,
          afternoon: `${district.localFood[0] || 'লোকাল খাবার'} দিয়ে দুপুরের খাবার ও বিশ্রাম`,
          evening: i === formData.duration ? `শপিং ও ফেরার প্রস্তুতি` : `সূর্যাস্ত দেখা ও স্থানীয় বাজার ঘোরা`
        });
      }

      const generatedResult = {
        district,
        tours,
        hotels,
        costLine: {
          transport: transportEst,
          hotel: totalHotel,
          food: totalFood,
          activities: activitiesEst > 0 ? activitiesEst : 0,
          total: transportEst + totalHotel + totalFood + Math.max(0, activitiesEst)
        },
        days,
        packing: ['NID/পাসপোর্ট', 'পাওয়ার ব্যাংক', 'প্রয়োজনীয় ওষুধ', ...((formData.interests.includes('beach') || district.id === 'cox-bazar') ? ['সানস্ক্রিন SPF 50+', 'সুইমওয়্যার'] : []), ...((formData.interests.includes('mountain') || district.id === 'bandarban') ? ['ট্রেকিং জুতা', 'উষ্ণ কাপড়'] : [])]
      };

      setResult(generatedResult);
      localStorage.setItem('madventure-planner-v1', JSON.stringify({ formData, result: generatedResult }));
      setIsGenerating(false);
      setStep(6);
      setSaved(false);
    }, 2000);
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      alert("Please login to save your plan.");
      return;
    }
    setIsSaving(true);
    const itineraryData = {
      user_id: user.id,
      title: `${result.district.name} Trip Plan`,
      destination: result.district.name,
      duration_days: formData.duration,
      start_date: formData.startDate,
      budget_estimate: result.costLine.total,
      plan_data: { formData, result },
      share_slug: `${result.district.id}-${Date.now().toString(36)}`
    };

    const { data, error } = await saveItinerary(itineraryData);
    if (error) {
      alert(error.message);
    } else {
      setSaved(true);
      alert("Plan saved successfully to your profile!");
    }
    setIsSaving(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = encodeURIComponent(`আমার ${result.district.name} ট্রিপের প্ল্যান (Madventure)\nমোট খরচ: ৳${result.costLine.total}\nসময়কাল: ${formData.duration} দিন`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (isGenerating) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">আপনার নিখুঁত ট্রিপ প্ল্যান করা হচ্ছে...</h3>
        <p className="text-gray-500">বাজেট, পছন্দ আর অন্যান্য তথ্য বিশ্লেষণ করে অপ্টিমাইজড রুট তৈরি হচ্ছে</p>
      </div>
    );
  }

  if (step === 6 && result) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" id="itinerary-result">
        {/* Result Header */}
        <div className="bg-[#1B5E20] p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${result.district.heroImage})` }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">আপনার {result.district.name} ট্রিপ</h2>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1"><Calendar size={16}/> {formData.duration} দিন</span>
              <span className="flex items-center gap-1"><Users size={16}/> {GROUP_TYPES.find(g=>g.id===formData.groupType).label}</span>
              <span className="flex items-center gap-1"><Wallet size={16}/> এস্টিমেট: ৳{result.costLine.total.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={handleSaveToCloud} 
                disabled={isSaving || saved}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg ${saved ? 'bg-blue-600 text-white' : 'bg-white text-[#1B5E20] hover:bg-gray-100'}`}
              >
                {isSaving ? <Loader2 size={18} className="animate-spin"/> : saved ? <CheckCircle size={18}/> : <Save size={18} />}
                {saved ? 'সংরক্ষিত' : 'প্ল্যান সেভ করুন'}
              </button>
              <button onClick={handlePrint} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors">
                <Download size={18} /> PDF ডাউনলোড
              </button>
              <button onClick={handleShare} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors">
                <Share2 size={18} /> হোয়াটসঅ্যাপে শেয়ার
              </button>
              <button onClick={() => {setResult(null); setStep(1);}} className="ml-auto underline opacity-80 hover:opacity-100 pb-1">
                নতুন প্ল্যান করুন
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 border-b pb-4">
              <Calendar className="text-primary" /> দিনভিত্তিক রূপরেখা
            </h3>
            
            <div className="space-y-4">
              {result.days.map((day) => (
                <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setActiveDay(activeDay === day.day ? null : day.day)}
                    className={`w-full flex items-center justify-between p-4 font-bold text-left transition-colors ${activeDay === day.day ? 'bg-green-50 text-primary' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <span>দিন {day.day}</span>
                    {activeDay === day.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {activeDay === day.day && (
                    <div className="p-6 bg-white space-y-6">
                      <div className="flex gap-4">
                        <div className="bg-orange-100 text-orange-600 p-3 rounded-full h-fit"><Sun size={20}/></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">সকাল</h4>
                          <p className="text-gray-600 text-sm">{day.morning}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full h-fit"><Sun size={20}/></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">দুপুর</h4>
                          <p className="text-gray-600 text-sm">{day.afternoon}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full h-fit"><Sunset size={20}/></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">সন্ধ্যা</h4>
                          <p className="text-gray-600 text-sm">{day.evening}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Wallet className="text-primary" /> সম্ভাব্য খরচ (মোট)
              </h3>
              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>যাতায়াত</span>
                  <span className="font-bold text-gray-800">৳{result.costLine.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>হোটেল ({formData.duration - 1} রাত)</span>
                  <span className="font-bold text-gray-800">৳{result.costLine.hotel.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>খাবার</span>
                  <span className="font-bold text-gray-800">৳{result.costLine.food.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>অ্যাক্টিভিটি ও অন্যান্য</span>
                  <span className="font-bold text-gray-800">৳{result.costLine.activities.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-[#1B5E20]">
                  <span>মোট</span>
                  <span>৳{result.costLine.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <h3 className="font-bold text-[#1B5E20] mb-4 flex items-center gap-2">
                <CheckCircle className="text-primary" /> রিকমেন্ডেশন
              </h3>
              {result.hotels.length > 0 && (
                <div className="mb-4 bg-white p-3 rounded-xl shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">সাজেস্টেড হোটেল</p>
                  <p className="font-bold text-gray-800">{result.hotels[0].name}</p>
                  <p className="text-xs text-gray-500 mt-1">৳{result.hotels[0].pricePerNight.min}/রাত</p>
                  <Link to={`/business/${result.hotels[0].id}`} className="mt-2 block w-full text-center bg-primary text-white text-sm py-2 rounded-lg font-bold hover:bg-green-600 transition-colors">হোটেল বুক করুন</Link>
                </div>
              )}
              {result.tours.length > 0 && (
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">সাজেস্টেড ট্যুর</p>
                  <p className="font-bold text-gray-800">{result.tours[0].title}</p>
                  <Link to={`/tours/${result.tours[0].id}`} className="mt-2 block w-full text-center border-2 border-primary text-primary text-sm py-2 rounded-lg font-bold hover:bg-green-50 transition-colors">প্যাকেজ দেখুন</Link>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">প্যাকিং লিস্ট</h3>
              <ul className="space-y-2">
                {result.packing.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto my-8">
      <div className="flex items-center gap-2 mb-8 text-[#1B5E20]">
        <Sparkles size={28} />
        <h2 className="text-2xl font-bold">এআই ট্রিপ প্ল্যানার</h2>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block font-bold text-gray-800 mb-3 flex items-center gap-2"><MapPin size={18} className="text-primary"/> ১. কোথায় যেতে চান?</label>
          <select 
            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold text-gray-700 bg-gray-50"
            value={formData.destinationId}
            onChange={e => setFormData({ ...formData, destinationId: e.target.value })}
          >
            <option value="">গন্তব্য নির্বাচন করুন...</option>
            {DISTRICTS.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.nameEn})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-gray-800 mb-3 flex items-center gap-2"><Calendar size={18} className="text-primary"/> ২. যাত্রার তারিখ</label>
            <input 
              type="date" 
              className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary bg-gray-50 outline-none font-bold text-gray-700"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-bold text-gray-800 mb-3">৩. কত দিন? ({formData.duration} দিন)</label>
            <input 
              type="range" min="1" max="14" 
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-4"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-800 mb-3 flex items-center gap-2"><Wallet size={18} className="text-primary"/> ৪. মাথাপিছু এস্টিমেট বাজেট (৳{formData.budget.toLocaleString('en-IN')})</label>
          <input 
            type="range" min="3000" max="50000" step="500"
            value={formData.budget}
            onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold">
            <span>৳৩,০০০</span>
            <span>৳৫০,০০০+</span>
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-800 mb-3 flex items-center gap-2"><Users size={18} className="text-primary"/> ৫. কাদের সাথে যাচ্ছেন?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GROUP_TYPES.map(g => (
              <button 
                key={g.id}
                onClick={() => setFormData({ ...formData, groupType: g.id })}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${formData.groupType === g.id ? 'border-primary bg-green-50 text-primary shadow-sm scale-[1.02]' : 'border-gray-100 hover:border-gray-200 bg-white text-gray-600'}`}
              >
                <g.icon size={24} />
                <span className="font-bold text-sm">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-800 mb-3 flex items-center gap-2"><Heart size={18} className="text-primary"/> ৬. প্রধান আকর্ষণ (একাধিক হতে পারে)</label>
          <div className="flex flex-wrap gap-3">
            {INTERESTS.map(i => {
              const active = formData.interests.includes(i.id);
              return (
                <button
                  key={i.id}
                  onClick={() => toggleInterest(i.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${active ? 'border-primary bg-primary text-white' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  {i.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button 
            onClick={handleGenerate}
            className="w-full md:w-auto bg-[#1B5E20] hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-lg shadow-green-900/20"
          >
            আমার ট্রিপ প্ল্যান তৈরি করুন <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryGenerator;
