import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/Toast';

const WishlistButton = ({ itemType, itemId, className = '' }) => {
    const { user } = useAuth();
    const { isInWishlist, toggleItem } = useWishlist();
    const toast = useToast();
    const [isAnimating, setIsAnimating] = useState(false);

    const isSaved = isInWishlist(itemType, itemId);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast?.info?.('Login Required', 'Please login to save to your wishlist.');
            return;
        }

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        try {
            await toggleItem(itemType, itemId);
            if (!isSaved) {
                toast?.success?.('Saved', 'Added to your wishlist!');
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            toast?.error?.('Error', 'Failed to update wishlist.');
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`flex items-center justify-center p-2 rounded-full backdrop-blur-md transition-all ${
                isSaved 
                    ? 'bg-rose-500/10 text-rose-500' 
                    : 'bg-black/20 text-white hover:bg-black/40'
            } ${className}`}
            aria-label="Save to wishlist"
        >
            <motion.div
                animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                <Heart 
                    size={20} 
                    className={isSaved ? 'fill-current' : ''} 
                />
            </motion.div>
        </motion.button>
    );
};

export default WishlistButton;
