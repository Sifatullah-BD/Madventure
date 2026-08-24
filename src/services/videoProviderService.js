export const PROVIDER_LABEL = { YOUTUBE: 'YouTube', BILIBILI: 'BiliBili' };

const HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'bilibili.com', 'www.bilibili.com', 'm.bilibili.com', 'bilibili.tv', 'www.bilibili.tv', 'b23.tv']);
const parse = value => {
    try {
        const url = new URL(String(value || '').trim());
        return /^https?:$/.test(url.protocol) && HOSTS.has(url.hostname.toLowerCase()) ? url : null;
    } catch { return null; }
};

export function detectProvider(value) {
    const url = parse(value);
    if (!url) return null;
    if (url.hostname.includes('youtube') || url.hostname === 'youtu.be') return 'YOUTUBE';
    if (url.hostname.includes('bilibili')) return 'BILIBILI';
    return null;
}

export function extractVideoId(value) {
    const url = parse(value);
    if (!url) return null;
    if (url.hostname === 'b23.tv') throw Object.assign(new Error('Short BiliBili links are not supported. Paste the full video URL.'), { code: 'SHORT_LINK' });
    if (url.hostname.includes('youtube')) {
        const id = url.searchParams.get('v') || url.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1];
        return id ? { id, playable: true } : null;
    }
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).match(/^[\w-]{11}$/) ? { id: url.pathname.slice(1), playable: true } : null;
    const mainland = url.pathname.match(/^\/video\/(BV[0-9A-Za-z]{10}|av\d+)/);
    if (mainland) return { id: mainland[1], playable: true };
    const intl = url.pathname.match(/^\/[a-z]{2}(?:-[a-z]{2})?\/(?:video|play)\/(\d+)/);
    return intl ? { id: intl[1], playable: false } : null;
}

export function getEmbedUrl(provider, id) {
    if (provider === 'YOUTUBE') return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    if (provider === 'BILIBILI' && /^BV[0-9A-Za-z]{10}$/.test(id)) return `https://player.bilibili.com/player.html?bvid=${id}&page=1&autoplay=0&danmaku=0`;
    if (provider === 'BILIBILI' && /^av\d+$/.test(id)) return `https://player.bilibili.com/player.html?aid=${id.slice(2)}&page=1&autoplay=0&danmaku=0`;
    return null;
}

export function getThumbnail(provider, id) {
    return provider === 'YOUTUBE' ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function buildVideoMeta(value) {
    const sourceUrl = String(value || '').trim();
    const provider = detectProvider(sourceUrl);
    const extracted = extractVideoId(sourceUrl);
    if (!provider || !extracted) throw Object.assign(new Error('Use a full YouTube or BiliBili video URL.'), { code: 'INVALID_VIDEO_URL' });
    return { provider, video_id: extracted.id, source_url: sourceUrl, embed_url: getEmbedUrl(provider, extracted.id), thumbnail_url: getThumbnail(provider, extracted.id) };
}