// Data Fallback Hero MLBB jika API offline atau gagal di-fetch
const FALLBACK_HEROES = [
    // ASSASSIN
    { id: 1, name: "Lancelot", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Lancelot_Infobox.png" },
    { id: 2, name: "Gusion", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Gusion_Infobox.png" },
    { id: 3, name: "Ling", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Ling_Infobox.png" },
    { id: 4, name: "Fanny", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Fanny_Infobox.png" },
    { id: 5, name: "Hayabusa", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Hayabusa_Infobox.png" },
    { id: 6, name: "Benedetta", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Benedetta_Infobox.png" },
    { id: 7, name: "Saber", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Saber_Infobox.png" },
    { id: 8, name: "Karina", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Karina_Infobox.png" },
    { id: 9, name: "Helcurt", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Helcurt_Infobox.png" },
    { id: 10, name: "Natalia", role: "Assassin", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Natalia_Infobox.png" },

    // TANK
    { id: 11, name: "Tigreal", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Tigreal_Infobox.png" },
    { id: 12, name: "Akai", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Akai_Infobox.png" },
    { id: 13, name: "Grock", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Grock_Infobox.png" },
    { id: 14, name: "Khufra", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Khufra_Infobox.png" },
    { id: 15, name: "Atlas", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Atlas_Infobox.png" },
    { id: 16, name: "Hylos", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Hylos_Infobox.png" },
    { id: 17, name: "Belerick", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Belerick_Infobox.png" },
    { id: 18, name: "Minotaur", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Minotaur_Infobox.png" },
    { id: 19, name: "Franco", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Franco_Infobox.png" },
    { id: 20, name: "Lolita", role: "Tank", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Lolita_Infobox.png" },

    // FIGHTER
    { id: 21, name: "Chou", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Chou_Infobox.png" },
    { id: 22, name: "Yu Zhong", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Yu_Zhong_Infobox.png" },
    { id: 23, name: "Lapu-Lapu", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Lapu-Lapu_Infobox.png" },
    { id: 24, name: "Paquito", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Paquito_Infobox.png" },
    { id: 25, name: "Ruby", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Ruby_Infobox.png" },
    { id: 26, name: "Balmond", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Balmond_Infobox.png" },
    { id: 27, name: "Martis", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Martis_Infobox.png" },
    { id: 28, name: "Alpha", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Alpha_Infobox.png" },
    { id: 29, name: "Alucard", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Alucard_Infobox.png" },
    { id: 30, name: "Aldous", role: "Fighter", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Aldous_Infobox.png" },

    // MAGE
    { id: 31, name: "Eudora", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Eudora_Infobox.png" },
    { id: 32, name: "Kagura", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Kagura_Infobox.png" },
    { id: 33, name: "Pharsa", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Pharsa_Infobox.png" },
    { id: 34, name: "Lunox", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Lunox_Infobox.png" },
    { id: 35, name: "Harith", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Harith_Infobox.png" },
    { id: 36, name: "Valir", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Valir_Infobox.png" },
    { id: 37, name: "Nana", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Nana_Infobox.png" },
    { id: 38, name: "Cecilion", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Cecilion_Infobox.png" },
    { id: 39, name: "Chang'e", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Chang'e_Infobox.png" },
    { id: 40, name: "Yve", role: "Mage", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Yve_Infobox.png" },

    // MARKSMAN
    { id: 41, name: "Miya", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Miya_Infobox.png" },
    { id: 42, name: "Layla", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Layla_Infobox.png" },
    { id: 43, name: "Granger", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Granger_Infobox.png" },
    { id: 44, name: "Claude", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Claude_Infobox.png" },
    { id: 45, name: "Karrie", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Karrie_Infobox.png" },
    { id: 46, name: "Wanwan", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Wanwan_Infobox.png" },
    { id: 47, name: "Beatrix", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Beatrix_Infobox.png" },
    { id: 48, name: "Brody", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Brody_Infobox.png" },
    { id: 49, name: "Bruno", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Bruno_Infobox.png" },
    { id: 50, name: "Clint", role: "Marksman", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Clint_Infobox.png" },

    // SUPPORT
    { id: 51, name: "Estes", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Estes_Infobox.png" },
    { id: 52, name: "Rafaela", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Rafaela_Infobox.png" },
    { id: 53, name: "Angela", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Angela_Infobox.png" },
    { id: 54, name: "Floryn", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Floryn_Infobox.png" },
    { id: 55, name: "Mathilda", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Mathilda_Infobox.png" },
    { id: 56, name: "Diggie", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Diggie_Infobox.png" },
    { id: 57, name: "Kaja", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Kaja_Infobox.png" },
    { id: 58, name: "Faramis", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Faramis_Infobox.png" },
    { id: 59, name: "Carmilla", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Carmilla_Infobox.png" },
    { id: 60, name: "Minotaur", role: "Support", image: "https://mobile-legends.fandom.com/wiki/Special:FilePath/Minotaur_Infobox.png" } // Minotaur dual role
];

// Helper untuk fetch data hero
async function fetchHeroes() {
    try {
        // Fetch dari file JSON lokal yang disediakan oleh user
        const response = await fetch("js/hero-meta-final.json");
        if (!response.ok) throw new Error("Gagal memuat file hero-meta-final.json");
        
        const json = await response.json();
        if (json && Array.isArray(json.data)) {
            // Filter out "None" hero dan map data ke format UI
            return json.data
                .filter(h => h.hero_name && h.hero_name !== "None")
                .map((h, index) => {
                    // Jika dual class (misal "Tank, Mage"), ambil class pertama sebagai role utama
                    const role = h.class ? h.class.split(",")[0].trim() : "Fighter";
                    
                    return {
                        id: h.mlid || `local-${index}`,
                        name: h.hero_name,
                        role: role,
                        // Gunakan portrait resmi jika ada, jika tidak pakai Fandom wiki fallback
                        image: h.portrait || `https://mobile-legends.fandom.com/wiki/Special:FilePath/${encodeURIComponent(h.hero_name)}_Infobox.png`
                    };
                });
        }
        throw new Error("Format JSON tidak sesuai standar");
    } catch (error) {
        console.warn("Gagal membaca json lokal, menggunakan data fallback:", error.message);
        return FALLBACK_HEROES;
    }
}
