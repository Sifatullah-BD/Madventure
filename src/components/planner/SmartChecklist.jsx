import React, { useState, useEffect } from 'react';
import { DISTRICTS } from '../../data/madventure-data';
import { CheckSquare, Plus, Trash2, MapPin, Search } from 'lucide-react';

const CHECKLIST_RULES = {
  beach: { category: "👕 Clothing & Gear", items: ["সানস্ক্রিন SPF 50+", "সুইমওয়্যার", "ক্যামেরা waterproof case", "হ্যাট/টুপি", "সানগ্লাস"] },
  mountain: { category: "👕 Clothing & Gear", items: ["উষ্ণ জ্যাকেট", "ট্রেকিং জুতা", "টর্চলাইট", "পোকামাকড় প্রতিরোধী স্প্রে", "ফার্স্ট এইড কিট"] },
  rainy_season: { category: "👕 Clothing & Gear", items: ["রেইনকোট", "ওয়াটারপ্রুফ ব্যাগ", "ছাতা"] },
  winter: { category: "👕 Clothing & Gear", items: ["কম্বল/শাল", "গরম পোশাক", "ময়েশ্চারাইজার", "লিপবাম"] },
  always: { category: "📋 Documents & Essentials", items: ["NID/পাসপোর্ট", "নগদ টাকা (BDT)", "প্রয়োজনীয় ওষুধ", "পাওয়ার ব্যাংক", "অ্যাডাপ্টার", "টিস্যু/ওয়েপস"] }
};

const CATEGORY_ICONS = {
  "📋 Documents & Essentials": "📋",
  "👕 Clothing & Gear": "👕",
  "💊 Medicine": "💊",
  "📱 Electronics": "📱",
  "Custom Items": "✨"
};

const SmartChecklist = () => {
  const [destinationId, setDestinationId] = useState('');
  const [month, setMonth] = useState('');
  const [checklist, setChecklist] = useState({});
  const [newItemText, setNewItemText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('madventure-checklist');
    if (saved) {
      setChecklist(JSON.parse(saved));
    } else {
      generateChecklist(); // Generate default "always" list
    }
  }, []);

  const generateChecklist = () => {
    // Determine context based on destination and month
    const district = DISTRICTS.find(d => d.id === destinationId);
    let categoriesToApply = ['always']; // Base
    
    if (district) {
      if (district.highlights.join(' ').toLowerCase().includes('বিচ') || district.id === 'cox-bazar') categoriesToApply.push('beach');
      if (district.highlights.join(' ').toLowerCase().includes('পাহাড়') || district.id === 'bandarban') categoriesToApply.push('mountain');
    }

    if (month) {
      const mn = parseInt(month.split('-')[1]);
      if (mn >= 6 && mn <= 9) categoriesToApply.push('rainy_season'); // June-Sep
      if (mn === 12 || mn === 1 || mn === 2) categoriesToApply.push('winter'); // Dec-Feb
    }

    const newChecklist = {};
    
    categoriesToApply.forEach(ruleKey => {
      const rule = CHECKLIST_RULES[ruleKey];
      if (!newChecklist[rule.category]) newChecklist[rule.category] = [];
      
      rule.items.forEach(item => {
        newChecklist[rule.category].push({ id: Math.random().toString(), text: item, done: false });
      });
    });

    setChecklist(newChecklist);
    localStorage.setItem('madventure-checklist', JSON.stringify(newChecklist));
    setShowCelebration(false);
  };

  const toggleItem = (category, itemId) => {
    const updated = { ...checklist };
    const itemIndex = updated[category].findIndex(i => i.id === itemId);
    updated[category][itemIndex].done = !updated[category][itemIndex].done;
    
    setChecklist(updated);
    localStorage.setItem('madventure-checklist', JSON.stringify(updated));
    checkCompletion(updated);
  };

  const deleteItem = (category, itemId) => {
    const updated = { ...checklist };
    updated[category] = updated[category].filter(i => i.id !== itemId);
    if (updated[category].length === 0) delete updated[category];
    
    setChecklist(updated);
    localStorage.setItem('madventure-checklist', JSON.stringify(updated));
    checkCompletion(updated);
  };

  const addCustomItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const updated = { ...checklist };
    if (!updated["Custom Items"]) updated["Custom Items"] = [];
    
    updated["Custom Items"].push({
      id: Math.random().toString(),
      text: newItemText.trim(),
      done: false
    });

    setChecklist(updated);
    localStorage.setItem('madventure-checklist', JSON.stringify(updated));
    setNewItemText('');
    checkCompletion(updated);
  };

  const checkCompletion = (list) => {
    let allDone = true;
    let hasItems = false;
    
    Object.values(list).forEach(categoryItems => {
      if (categoryItems.length > 0) hasItems = true;
      categoryItems.forEach(item => {
        if (!item.done) allDone = false;
      });
    });

    if (hasItems && allDone) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    } else {
      setShowCelebration(false);
    }
  };

  // Progress calculations
  let totalItems = 0;
  let doneItems = 0;
  Object.values(checklist).forEach(categoryItems => {
    categoryItems.forEach(item => {
      totalItems++;
      if (item.done) doneItems++;
    });
  });
  const progressPercent = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto my-8 relative">
      
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-500">
          <div className="bg-[#1B5E20] text-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce">
            <span className="text-6xl mb-2">🎉</span>
            <h2 className="text-2xl font-bold text-center">অভিনন্দন!</h2>
            <p>আপনার প্যাকিং ১০০% সম্পন্ন হয়েছে।</p>
          </div>
        </div>
      )}

      {/* Header Form Area */}
      <div className="bg-gray-50 border-b border-gray-100 p-8">
        <div className="flex items-center gap-2 mb-6 text-secondary">
          <CheckSquare size={28} />
          <h2 className="text-2xl font-bold">স্মার্ট প্যাকিং চেকলিস্ট</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block font-bold text-gray-800 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-primary"/> গন্তব্য (ঐচ্ছিক)
            </label>
            <select 
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary bg-white outline-none font-bold"
              value={destinationId}
              onChange={e => setDestinationId(e.target.value)}
            >
              <option value="">কোথায় যাচ্ছেন?</option>
              {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-4">
            <label className="block font-bold text-gray-800 mb-2">সম্ভাব্য মাস</label>
            <input 
              type="month" 
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary bg-white outline-none font-bold"
              value={month}
              onChange={e => setMonth(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <button 
              onClick={generateChecklist}
              className="w-full bg-[#1B5E20] hover:bg-green-800 text-white p-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Search size={18} /> জেনারেট
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between font-bold text-gray-800 mb-2">
            <span>প্রস্তুতি</span>
            <span className={progressPercent === 100 ? 'text-green-600' : 'text-primary'}>
              {doneItems}/{totalItems} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${progressPercent === 100 ? 'bg-green-500' : 'bg-primary'}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(checklist).map(([category, items]) => (
            <div key={category} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-lg text-[#1B5E20] border-b pb-2 mb-4 flex items-center gap-2">
                <span>{CATEGORY_ICONS[category] || '🔹'}</span> {category}
              </h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center group">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={item.done}
                          onChange={() => toggleItem(category, item.id)}
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          <CheckSquare size={16} className="text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-transform" />
                        </div>
                      </div>
                      <span className={`text-gray-700 transition-all ${item.done ? 'line-through opacity-50' : 'font-medium'}`}>
                        {item.text}
                      </span>
                    </label>
                    <button 
                      onClick={() => deleteItem(category, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Custom Item */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 border-dashed flex flex-col justify-center">
            <h3 className="font-bold text-blue-800 mb-3 text-center">নতুন আইটেম যোগ করুন</h3>
            <form onSubmit={addCustomItem} className="flex gap-2">
              <input 
                type="text" 
                placeholder="যেমন: পাওয়ার কর্ড..."
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-blue-200 outline-none focus:border-blue-500 bg-white"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
                disabled={!newItemText.trim()}
              >
                <Plus size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartChecklist;
