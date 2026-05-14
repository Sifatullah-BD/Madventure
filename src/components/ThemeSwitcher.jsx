import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

const themes = [
    { id: "forest", color: "#1B5E20", name: "theme_forest" },
    { id: "ocean", color: "#01579B", name: "theme_ocean" },
    { id: "sunset", color: "#BF360C", name: "theme_sunset" },
    { id: "midnight", color: "#212121", name: "theme_midnight" },
    { id: "earth", color: "#3E2723", name: "theme_earth" },
];

export default function ThemeSwitcher() {
    const [activeTheme, setActiveTheme] = useState("forest");
    const { t } = useTranslation();

    useEffect(() => {
        // Load saved theme from local storage
        const savedTheme = localStorage.getItem("app-theme") || "forest";
        document.documentElement.setAttribute("data-theme", savedTheme);
        setActiveTheme(savedTheme);
    }, []);

    const handleThemeChange = (themeId) => {
        document.documentElement.setAttribute("data-theme", themeId);
        localStorage.setItem("app-theme", themeId);
        setActiveTheme(themeId);
    };

    return (
        <div className="flex gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md justify-center">
            {themes.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${activeTheme === theme.id ? "border-white scale-110 ring-2 ring-offset-2 ring-gray-400" : "border-transparent"
                        }`}
                    style={{ backgroundColor: theme.color }}
                    title={t(theme.name)}
                >
                    {activeTheme === theme.id && <Check size={16} className="text-white" />}
                </button>
            ))}
        </div>
    );
}
