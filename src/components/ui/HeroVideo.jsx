import React from 'react';

const HeroVideo = ({ url }) => {
    const getVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(url);

    if (!videoId) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                title="Background Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute w-[300%] h-[300%] top-[-100%] left-[-100%] md:w-[150%] md:h-[150%] md:top-[-25%] md:left-[-25%] border-0 opacity-80"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>
    );
};

export default HeroVideo;
