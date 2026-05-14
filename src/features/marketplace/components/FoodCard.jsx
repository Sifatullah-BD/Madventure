import { Link } from 'react-router-dom';

const placeholderImage = '/marketplace-food-placeholder.jpg';

const FoodCard = ({ vendor }) => {
  const menu = vendor.food_menus?.[0] || {};

  return (
    <article className="group bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/marketplace/vendor/${vendor.slug || vendor.id}`} className="block">
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={menu.image_url || placeholderImage}
            alt={vendor.business_name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{vendor.business_name}</h3>
              <p className="text-sm text-gray-500">{vendor.district_id || 'Unknown District'}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
              ⭐ {vendor.rating?.toFixed(1) ?? '0.0'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">সেরা মেনু:</span> {menu.item_name || 'বাংলা খাবার'}</p>
            <p><span className="font-semibold">শ্রেণী:</span> {menu.category || 'ভাত'}</p>
            <p><span className="font-semibold">দর:</span> ৳{menu.price ?? ১৫০}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default FoodCard;
