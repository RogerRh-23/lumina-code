export type ExportFormat = "css" | "scss" | "tailwind" | "json";

export class ExportService {

    public generateCode(colors: string[], format: ExportFormat): string {
        switch (format) {
            case "css":
                return this.toCSS(colors);
            case "scss":
                return this.toSCSS(colors);
            case "tailwind":
                return this.toTailwind(colors);
            case "json":
                return JSON.stringify(colors, null, 2);
            default:
                return this.toCSS(colors);
        }
    }

    private toCSS(colors: string[]): string {
        return `:root {\n` +
            colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') +
            `\n}`;
    }

    private toSCSS(colors: string[]): string {
        return colors.map((c, i) => `$color-${i + 1}: ${c};`).join('\n');
    }

    private toTailwind(colors: string[]): string {
        return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n` +
            colors.map((c, i) => `        'brand-${i + 1}': '${c}',`).join('\n') +
            `\n      }\n    }\n  }\n}`;
    }
}