import React from 'react';
import { Star, ShoppingCart, Calendar } from 'lucide-react';

const ProductCard = ({ product, onRent, onBuy }) => {
    const isRent = product.category === 'Rent';

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {product.rating}
                </div>
                {isRent && (
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm">
                        Rent
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{product.type}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                        {product.description}
                    </p>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">
                                {isRent ? 'Daily Rate' : 'Price'}
                            </p>
                            <p className="text-xl font-bold text-primary">
                                ৳{product.price}
                                {isRent && <span className="text-xs text-gray-400 font-normal">/day</span>}
                            </p>
                        </div>
                        {isRent && (
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 line-through">৳{product.retailPrice}</p>
                                <p className="text-[10px] text-green-600 font-bold">Save {(100 - (product.price / product.retailPrice) * 100).toFixed(0)}%</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => isRent ? onRent(product) : onBuy(product)}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isRent
                                ? 'bg-primary text-white hover:bg-green-800 shadow-lg shadow-green-900/20'
                                : 'bg-white border-2 border-primary text-primary hover:bg-green-50'
                            }`}
                    >
                        {isRent ? (
                            <>
                                <Calendar size={18} /> Rent Now
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={18} /> Buy Now
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
