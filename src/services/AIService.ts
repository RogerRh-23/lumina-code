import { TinyColor, random } from "@ctrl/tinycolor";

// ==========================================
// 1. DICCIONARIO DE TONOS (Definen el color base)
// ==========================================
// Mapea palabras -> Rango de Hue (0-360)
const HUE_DICTIONARY: Record<string, [number, number]> = {
    // --- COLORES DIRECTOS ---
    'rojo': [340, 10], 'red': [340, 10], 'carmesí': [330, 350], 'granate': [340, 360],
    'naranja': [15, 40], 'orange': [15, 40], 'coral': [5, 25],
    'amarillo': [45, 65], 'yellow': [45, 65], 'dorado': [40, 55], 'oro': [40, 55],
    'verde': [80, 150], 'green': [80, 150], 'lima': [70, 90], 'oliva': [60, 80],
    'cian': [170, 190], 'cyan': [170, 190], 'turquesa': [160, 180], 'teal': [160, 180],
    'azul': [195, 245], 'blue': [195, 245], 'indigo': [220, 250], 'marino': [210, 240],
    'morado': [250, 290], 'purple': [250, 290], 'violeta': [260, 280], 'lila': [270, 300],
    'rosa': [300, 340], 'pink': [300, 340], 'magenta': [290, 320], 'fucsia': [290, 310],
    'marron': [15, 35], 'cafe': [15, 35], 'brown': [15, 35], 'beige': [30, 50],

    // --- NATURALEZA ---
    'fuego': [0, 25], 'lava': [0, 20], 'calor': [0, 30], 'infierno': [0, 10],
    'sol': [45, 60], 'luz': [45, 60], 'verano': [30, 60], 'desierto': [30, 50], 'arena': [35, 50],
    'bosque': [90, 140], 'selva': [100, 150], 'hoja': [80, 130], 'planta': [90, 140], 'jardin': [90, 150],
    'eco': [100, 140], 'bio': [100, 140], 'naturaleza': [90, 140], 'campo': [80, 120],
    'mar': [190, 230], 'oceano': [200, 240], 'agua': [185, 220], 'playa': [170, 210], 'hielo': [180, 200],
    'cielo': [195, 215], 'aire': [190, 220], 'nube': [200, 220], 'frio': [190, 230],
    'tierra': [20, 40], 'madera': [25, 45], 'piedra': [0, 0], 'roca': [0, 0], // Saturation 0 handled later

    // --- COMIDA & BEBIDA ---
    'fruta': [0, 60], 'manzana': [350, 10], 'fresa': [340, 360], 'cereza': [340, 360],
    'naranja_fruta': [20, 40], 'limon': [50, 65], 'banana': [45, 60],
    'cafe_bebida': [20, 40], 'chocolate': [15, 30], 'cookie': [25, 40], 'pan': [30, 45],
    'vino': [330, 350], 'cerveza': [40, 55], 'miel': [40, 50],
    'menta': [140, 170], 'vegetal': [90, 140], 'ensalada': [80, 130],

    // --- EMOCIONES & CONCEPTOS ---
    'amor': [340, 10], 'pasion': [340, 10], 'romantico': [330, 350],
    'peligro': [0, 10], 'error': [0, 10], 'alerta': [10, 30], 'urgente': [0, 20],
    'alegria': [45, 60], 'feliz': [45, 65], 'energia': [20, 50], 'diversion': [30, 60],
    'calma': [190, 220], 'paz': [180, 210], 'tranquilo': [190, 230], 'relax': [170, 200],
    'triste': [210, 240], 'depresion': [220, 250], 'serio': [210, 240],
    'magia': [260, 290], 'misterio': [270, 300], 'fantasia': [260, 300], 'espiritual': [250, 280],
    'lujo': [40, 55], 'realeza': [260, 280], 'dinero': [100, 140], 'exito': [45, 60],

    // --- INDUSTRIAS & TECH ---
    'tech': [200, 240], 'tecnologia': [200, 250], 'futuro': [180, 220], 'robot': [200, 220],
    'codigo': [210, 260], 'app': [200, 240], 'startup': [210, 250],
    'salud': [170, 200], 'medico': [180, 220], 'hospital': [170, 210], 'farmacia': [100, 140],
    'finanzas': [210, 240], 'banco': [210, 240], 'negocio': [210, 230], 'corporativo': [210, 230],
    'construccion': [25, 45], 'industrial': [200, 220], 'arquitectura': [200, 220],
    'moda': [300, 340], 'belleza': [320, 350], 'makeup': [330, 10],
    'gamer': [260, 290], 'juego': [260, 300], 'consola': [210, 270],
    'social': [200, 220], 'chat': [200, 230],

    // --- ESTILOS VISUALES ---
    'cyberpunk': [280, 320], 'vaporwave': [280, 340], 'synthwave': [270, 330],
    'retro': [30, 50], 'vintage': [25, 45], 'antiguo': [30, 50],
    'halloween': [15, 35], 'navidad': [350, 10], // O verde, pero rojo domina
};

// ==========================================
// 2. DICCIONARIO DE MODIFICADORES (Luz y Saturación)
// ==========================================
// Mapea palabras -> Rangos de Sat (0-100) y Val (0-100)
interface Modifier {
    sat?: [number, number];
    val?: [number, number];
}

const MOD_DICTIONARY: Record<string, Modifier> = {
    // --- LUMINOSIDAD (Oscuro vs Claro) ---
    'oscuro': { val: [10, 30], sat: [40, 70] }, 'dark': { val: [10, 30], sat: [40, 70] },
    'noche': { val: [5, 20], sat: [50, 80] }, 'nocturno': { val: [5, 20], sat: [50, 80] }, 'nocturna': { val: [5, 20], sat: [50, 80] },
    'profundo': { val: [20, 40], sat: [70, 100] }, 'deep': { val: [20, 40], sat: [70, 100] },
    'sombra': { val: [0, 20] }, 'black': { val: [0, 10] }, 'negro': { val: [0, 10] },

    'claro': { val: [85, 100], sat: [10, 40] }, 'light': { val: [85, 100], sat: [10, 40] },
    'dia': { val: [90, 100], sat: [40, 70] }, 'brillante': { val: [90, 100] },
    'blanco': { val: [95, 100], sat: [0, 5] }, 'white': { val: [95, 100], sat: [0, 5] },
    'nieve': { val: [95, 100], sat: [0, 10] },

    // --- SATURACIÓN (Vibrante vs Apagado) ---
    'neon': { sat: [90, 100], val: [90, 100] }, 'fluo': { sat: [90, 100], val: [90, 100] },
    'vibrante': { sat: [80, 100], val: [80, 100] }, 'vivo': { sat: [80, 100], val: [80, 100] },
    'electrico': { sat: [90, 100], val: [80, 100] }, 'intenso': { sat: [80, 100] },

    'pastel': { sat: [20, 45], val: [90, 100] }, 'suave': { sat: [20, 40], val: [80, 95] },
    'bebe': { sat: [10, 30], val: [90, 100] }, 'dulce': { sat: [30, 50], val: [90, 100] },

    'apagado': { sat: [10, 30] }, 'muted': { sat: [10, 30] },
    'gris': { sat: [0, 0] }, 'grey': { sat: [0, 0] }, 'desaturado': { sat: [0, 20] },
    'cemento': { sat: [0, 5], val: [50, 70] }, 'acero': { sat: [0, 10], val: [60, 80] },
    'metal': { sat: [0, 15], val: [60, 90] }, 'silver': { sat: [0, 5], val: [80, 100] },

    // --- ESTILOS COMPLEJOS ---
    'minimalista': { sat: [0, 10], val: [85, 100] }, 'clean': { sat: [0, 10], val: [90, 100] },
    'elegante': { sat: [15, 35], val: [15, 40] }, 'lujo': { sat: [40, 60], val: [30, 50] },
    'serio': { sat: [10, 30], val: [30, 60] }, 'formal': { sat: [10, 30], val: [20, 50] },
    'cyberpunk': { sat: [90, 100], val: [60, 90] }, // Oscuro pero muy saturado
    'retro': { sat: [30, 60], val: [60, 80] }, // Un poco lavado
    'vintage': { sat: [20, 50], val: [50, 70] },
};


export class AIService {

    public generatePalette(prompt: string): string[] {
        const text = this.normalizeText(prompt);

        // --- PASO 1: DETECTAR INTENCIÓN ---
        let targetHue: number | null = null;
        let targetSat: number = this.randomInt(40, 70);
        let targetVal: number = this.randomInt(50, 90);

        // Buscamos palabras
        const words = text.split(" ");

        words.forEach(word => {
            // A. Tono (Hue)
            if (HUE_DICTIONARY[word]) {
                const range = HUE_DICTIONARY[word];
                targetHue = this.randomInt(range[0], range[1]);
            }
            // B. Modificador (Luz/Sat)
            if (MOD_DICTIONARY[word]) {
                const mod = MOD_DICTIONARY[word];
                if (mod.sat) targetSat = this.randomInt(mod.sat[0], mod.sat[1]);
                if (mod.val) targetVal = this.randomInt(mod.val[0], mod.val[1]);
            }
        });

        // --- PASO 2: FALLBACKS INTELIGENTES ---
        if (targetHue === null) {
            targetHue = this.randomInt(0, 360);
        }

        // Caso especial: Grises y neutros
        const grayKeywords = ['gris', 'plata', 'acero', 'metal', 'cemento', 'minimalista', 'blanco', 'negro'];
        if (grayKeywords.some(k => text.includes(k))) {
            targetSat = Math.min(targetSat, 10); // Forzamos baja saturación
        }

        // --- PASO 3: GENERAR BASE ---
        const baseColor = new TinyColor({ h: targetHue, s: targetSat, v: targetVal });

        // --- PASO 4: ESTRATEGIA DE ARMONÍA ---
        let palette: string[] = [];
        const isDark = targetVal < 40;
        const isNeon = targetSat > 80;

        if (isDark) {
            // Para temas oscuros, Monocromático es lo más seguro y elegante
            palette = baseColor.monochromatic(5).map(c => c.toHexString());
        }
        else if (isNeon || text.includes('cyberpunk') || text.includes('gamer')) {
            // Tétrada para máximo contraste
            palette = baseColor.tetrad().map(c => c.toHexString());
            palette.push(baseColor.complement().toHexString());
        }
        else if (text.includes('pastel') || text.includes('suave')) {
            // Split complement funciona lindo en pastel
            palette = baseColor.splitcomplement().map(c => c.toHexString());
            // Rellenamos hasta 5
            while (palette.length < 5) {
                palette.push(new TinyColor(palette[0]).lighten(randomInt(10, 20)).toHexString());
            }
        }
        else {
            // Análoga es la "vieja confiable" para diseño web standard
            palette = baseColor.analogous(5).map(c => c.toHexString());
        }

        // Recortar a 5 por si acaso
        return palette.slice(0, 5);
    }

    public generateMixed(colors: string[]): string[] {
        // Filtramos colores inválidos
        const validColors = colors.filter(c => new TinyColor(c).isValid);

        if (validColors.length === 0) return this.generateFromHex("#000000"); // Fallback

        // Si solo hay uno, usamos la lógica anterior
        if (validColors.length === 1) {
            return this.generateFromHex(validColors[0]);
        }

        // Si hay varios (2 o 3), los respetamos y rellenamos el resto
        let palette = [...validColors];
        const base = new TinyColor(validColors[0]);

        // Rellenamos hasta tener 5 colores
        while (palette.length < 5) {
            // Estrategia: Buscar colores que conecten los existentes o complementarios suaves
            const nextColor = base.analogous(7)[palette.length].toHexString();
            palette.push(nextColor);
        }

        return palette.slice(0, 5);
    }

    public generateFromHex(hex: string): string[] {
        const base = new TinyColor(hex);
        if (!base.isValid) return ["#000000", "#ffffff"]; // Fallback por si acaso

        // Usamos una tríada complementaria split para asegurar variedad pero armonía
        // Esto genera: Base, Contraste 1, Contraste 2.
        let palette = base.splitcomplement().map(c => c.toHexString());

        // Si TinyColor devuelve menos de 5 (a veces pasa), rellenamos
        while (palette.length < 5) {
            palette.push(new TinyColor(palette[0]).lighten(randomInt(10, 30)).toHexString());
        }

        return palette.slice(0, 5);
    }

    private normalizeText(text: string): string {
        return text.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar tildes
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""); // Quitar puntuación
    }

    private randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Helper suelto por si se necesita fuera
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}