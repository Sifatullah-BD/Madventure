import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const OptimizedImage = ({ src, alt, className, ...props }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin opacity-20" />
                </div>
            )}
            
            <img
                src={error ? '/placeholder-image.png' : src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                    setError(true);
                }}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
