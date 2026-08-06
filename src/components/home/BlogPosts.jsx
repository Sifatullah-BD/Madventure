import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const posts = [
  {
    id: 1,
    titleEn: 'Best Time & Tips for Sajek Valley',
    titleBn: 'সাজেক ভ্যালি ভ্রমণের সঠিক সময় এবং টিপস',
    image: '/images/destinations_hero_1_1778975470949.png',
    dateEn: 'May 12, 2024',
    dateBn: '১২ মে, ২০২৪',
    categoryEn: 'Guide',
    categoryBn: 'Guide',
    slug: 'sajek-valley-tips',
  },
  {
    id: 2,
    titleEn: 'What to see in Sundarbans? Complete Guideline',
    titleBn: 'সুন্দরবনে কি কি দেখবেন? পূর্ণাঙ্গ গাইডলাইন',
    image: '/images/destinations_hero_2_1778975509415.png',
    dateEn: 'May 10, 2024',
    dateBn: '১০ মে, ২০২৪',
    categoryEn: 'Adventure',
    categoryBn: 'Adventure',
    slug: 'sundarbans-guide',
  },
  {
    id: 3,
    titleEn: "5 Ways to Save Money on Cox's Bazar Trip",
    titleBn: 'কক্সবাজার ভ্রমণে খরচ বাঁচানোর ৫টি উপায়',
    image: '/images/destinations_hero_3_1778975530619.png',
    dateEn: 'May 5, 2024',
    dateBn: '০৫ মে, ২০২৪',
    categoryEn: 'Budget',
    categoryBn: 'Budget',
    slug: 'coxs-bazar-budget',
  },
];

const BlogPosts = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <section className="py-16 bg-[#08140c]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-forest-light font-black tracking-[0.5em] uppercase text-xs mb-4 block">
              Travel Guides
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              {language === 'bn' ? 'ভ্রমণ ডায়েরি' : 'Travel Diary'}
            </h2>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black hover:bg-forest-light transition-all flex items-center gap-3"
          >
            {language === 'bn' ? 'সব পড়ুন' : 'Read All'} <ArrowRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="group cursor-pointer relative"
            >
              <div className="h-[550px] rounded-[3.5rem] overflow-hidden relative shadow-2xl border border-white/5">
                <img
                  src={post.image}
                  alt={post.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050f08] via-[#050f08]/10 to-transparent" />
                <div className="absolute top-10 left-10">
                  <span className="px-5 py-2 bg-forest-light/90 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                    {language === 'bn' ? post.categoryBn : post.categoryEn}
                  </span>
                </div>
                <div className="absolute bottom-10 left-10 right-10">
                  <p className="text-forest-light font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                    {language === 'bn' ? post.dateBn : post.dateEn}
                  </p>
                  <h4 className="text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-green-400 transition-colors">
                    {language === 'bn' ? post.titleBn : post.titleEn}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPosts;
