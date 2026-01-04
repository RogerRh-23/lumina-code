import * as vscode from "vscode";

export interface SavedPalette {
    id: String;
    name: String;
    colors: string[];
    date: number;
}

export class StorageService {
    private static readonly KEY = "lumina_saved_palettes";

    constructor(private readonly _storage: vscode.Memento) { }

    public getPalettes(): SavedPalette[] {
        return this._storage.get<SavedPalette[]>(StorageService.KEY, []);
    }

    public savePalette(palette: SavedPalette, isPro: boolean): { success: boolean; error?: string } {
        const current = this.getPalettes();

        if (!isPro && current.length >= 5) {
            return {
                success: false,
                error: "Limite gratuito alcanzado (5/5). Actualiza a Pro para guardar más paletas."
            };
        }

        const updated = [palette, ...current];
        this._storage.update(StorageService.KEY, updated);
        return { success: true };
    }

    public deletePalette(id: string) {
        const current = this.getPalettes();
        const updated = current.filter(p => p.id !== id);
        this._storage.update(StorageService.KEY, updated);
        return updated;
    }
}