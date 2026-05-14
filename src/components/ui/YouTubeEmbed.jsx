import React from 'react';

const YouTubeEmbed = ({ url, title = "Travel Video", className = "" }) => {
    const getVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(url);

    if (!videoId) return null;

    return (
        <div className={`w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 ${className}`}>
            <div className="relative aspect-video">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                />
            </div>
        </div>
    );
};

export default YouTubeEmbed;
