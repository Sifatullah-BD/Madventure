import React, { useState } from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { products } from '../data/products';
import ProductCard from '../components/shop/ProductCard';
import RentalModal from '../components/shop/RentalModal';
import { useToast } from '../components/ui/Toast';

const Shop = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('Rent'); // Rent or Buy
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredProducts = products.filter(product => {
        const matchesCategory = product.category === activeTab;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleRentClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleBuyClick = (product) => {
        toast.success(`Added to Cart: ${product.name}`);
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Travel Gear Shop & Rental"
                subtitle="Get the best gear for your adventure. Rent premium equipment or buy travel essentials."
            />
            <div className="max-w-7xl mx-auto px-4 pb-20">
                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative mb-8">
                    <input
                        type="text"
                        placeholder="Search for tents, bags, gadgets..."
                        className="w-full py-3 px-6 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {/* Tabs */}
                <div className="bg-white p-2 rounded-2xl shadow-lg max-w-md mx-auto flex mb-12">
                    <button
                        onClick={() => setActiveTab('Rent')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'Rent'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        Rent Gear 🤝
                    </button>
                    <button
                        onClick={() => setActiveTab('Buy')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'Buy'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        Buy Essentials 🛒
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onRent={handleRentClick}
                            onBuy={handleBuyClick}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No items found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            <RentalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
};

export default Shop;
