import { TinyColor, readability } from "@ctrl/tinycolor";

export interface ColorMetric {
    hex: string;
    bestText: string; // "#000000" o "#ffffff" (La combinación correcta)
    contrast: number; // Ratio (ej: 12.5)
    rating: string;   // "AAA", "AA", "AA Large", "Fail"
    score: number;    // 0-100 para este color individual
}

export class ColorMath {

    /**
     * Analiza una lista de colores y devuelve métricas de accesibilidad
     */
    public analyzePalette(colors: string[]): { metrics: ColorMetric[], globalScore: number } {
        const metrics = colors.map(hex => this.analyzeColor(hex));

        // Calculamos el promedio para el "Lumina Score" global
        const totalScore = metrics.reduce((acc, curr) => acc + curr.score, 0);
        const globalScore = Math.round(totalScore / metrics.length);

        return { metrics, globalScore };
    }

    private analyzeColor(hex: string): ColorMetric {
        const color = new TinyColor(hex);

        // 1. ¿Contra qué se lee mejor? (Blanco o Negro)
        const whiteContrast = readability(color, "#ffffff");
        const blackContrast = readability(color, "#000000");
        const bestText = whiteContrast > blackContrast ? "#ffffff" : "#000000";
        const maxContrast = Math.max(whiteContrast, blackContrast);

        // 2. Determinar WCAG Rating
        let rating = "Fail";
        let score = 50; // Base score

        if (maxContrast >= 7) {
            rating = "AAA";
            score = 100;
        } else if (maxContrast >= 4.5) {
            rating = "AA";
            score = 85;
        } else if (maxContrast >= 3) {
            rating = "AA+"; // AA Large Text
            score = 70;
        } else {
            score = 40; // Legibilidad pobre
        }

        return {
            hex: hex,
            bestText: bestText,
            contrast: parseFloat(maxContrast.toFixed(2)),
            rating: rating,
            score: score
        };
    }
}