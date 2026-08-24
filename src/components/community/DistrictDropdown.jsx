import React, { useState } from 'react';
import { districtsData } from '../../data/districts.js';
import { useLanguage } from '../../context/LanguageContext';

const DistrictDropdown = () => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');

  // Flatten districts for easy search
  const allDistricts = districtsData.flatMap(div => div.districts);
  const filteredDistricts = allDistricts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const upazilas = selectedDistrict
    ? allDistricts.find(d => d.name === selectedDistrict)?.spots || []
    : [];

  return (
    <div className="max-w-2xl mx-auto my-4 p-3 md:p-4 bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input for districts */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={language === 'bn' ? 'জেলা খুঁজুন বা টাইপ করুন...' : 'Search or type district...'}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedDistrict(''); // Reset if typing
              setSelectedUpazila('');
            }}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-sm"
          />
          
          {search && !selectedDistrict && filteredDistricts.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
              {filteredDistricts.map(d => (
                <button
                  key={d.name}
                  onClick={() => {
                    setSelectedDistrict(d.name);
                    setSearch(d.name);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                >
                  {d.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Upazila select */}
        <div className="flex-1">
          <select
            value={selectedUpazila}
            onChange={e => setSelectedUpazila(e.target.value)}
            disabled={!selectedDistrict}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">
              {language === 'bn' ? 'উপজেলা নির্বাচন করুন' : 'Select Upazila'}
            </option>
            {upazilas.map(up => (
              <option key={up} value={up}>
                {up}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DistrictDropdown;
