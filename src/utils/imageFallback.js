// Shared image fallback (inline SVG — always works, even offline)
export const FALLBACK_IMAGE =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23e5e7eb'/%3E%3Cg fill='%239ca3af'%3E%3Cpath d='M340 260h120v16h-120zM348 276h104a14 14 0 0 1 14 14v60a14 14 0 0 1-14 14H348a14 14 0 0 1-14-14v-60a14 14 0 0 1 14-14z'/%3E%3Ccircle cx='400' cy='320' r='26'/%3E%3Cpath d='M360 320a40 40 0 0 1 80 0h-8a32 32 0 0 0-64 0z'/%3E%3C/g%3E%3C/svg%3E";

export const handleImageError = (e) => {
    const el = e.currentTarget;
    if (el && el.src !== FALLBACK_IMAGE) {
        el.src = FALLBACK_IMAGE;
    }
};
