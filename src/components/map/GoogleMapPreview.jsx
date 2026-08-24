import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

export default function GoogleMapPreview({ query = 'Bangladesh', height = 420 }) {
    const mapQuery = query.trim() || 'Bangladesh';
    const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    return (
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-slate-800">
                <div className="flex min-w-0 items-center gap-2">
                    <MapPin size={17} className="shrink-0 text-red-500" />
                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-400">Google Maps</p>
                        <p className="truncate text-sm font-bold text-gray-800 dark:text-gray-100">{mapQuery}</p>
                    </div>
                </div>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline">
                    Open <ExternalLink size={13} />
                </a>
            </div>
            <iframe title={`Google Maps location for ${mapQuery}`} src={embedUrl} width="100%" height={height} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="block border-0" />
        </section>
    );
}