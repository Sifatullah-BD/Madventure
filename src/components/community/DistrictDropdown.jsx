import React, { useState } from 'react';
import { districtsData } from '../../data/districts';
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
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex flex-col gap-4">
        {/* Search input for districts */}
        <input
          type="text"
          placeholder={language === 'bn' ? 'জেলা খুঁজুন...' : 'Search districts...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {/* District select */}
        <select
          value={selectedDistrict}
          onChange={e => {
            setSelectedDistrict(e.target.value);
            setSelectedUpazila('');
          }}
          className="p-3 border rounded-md bg-white dark:bg-gray-700"
        >
          <option value="">
            {language === 'bn' ? 'জেলা নির্বাচন করুন' : 'Select District'}
          </option>
          {filteredDistricts.map(d => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        {/* Upazila select */}
        <select
          value={selectedUpazila}
          onChange={e => setSelectedUpazila(e.target.value)}
          disabled={!selectedDistrict}
          className="p-3 border rounded-md bg-white dark:bg-gray-700"
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
  );
};

export default DistrictDropdown;
