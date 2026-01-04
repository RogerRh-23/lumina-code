import * as vscode from "vscode";
import { LuminaPanel } from "./panels/LuminaPanel";

export function activate(context: vscode.ExtensionContext) {
	// 1. Crear instancia de nuestro panel
	const provider = new LuminaPanel(context);

	// 2. Registrar el proveedor de la vista lateral
	// El ID "luminaCode.sidebarView" debe coincidir con el package.json
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			LuminaPanel.viewType,
			provider
		)
	);
}

export function deactivate() { }