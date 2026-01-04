/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
const LuminaPanel_1 = __webpack_require__(2);
function activate(context) {
    // 1. Crear instancia de nuestro panel
    const provider = new LuminaPanel_1.LuminaPanel(context);
    // 2. Registrar el proveedor de la vista lateral
    // El ID "luminaCode.sidebarView" debe coincidir con el package.json
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(LuminaPanel_1.LuminaPanel.viewType, provider));
}
function deactivate() { }


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuminaPanel = void 0;
const vscode = __importStar(__webpack_require__(1));
const getUri_1 = __webpack_require__(3);
const AIService_1 = __webpack_require__(4);
const ColorMath_1 = __webpack_require__(15);
const ExportService_1 = __webpack_require__(16);
const StorageService_1 = __webpack_require__(17);
const IS_PRO_USER = true;
// --- ICONOS SVG (INLINE) ---
const ICONS = {
    cloudUpload: `<svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8.45 2h-.9L4 5.5l.72.69L7.5 3.46V11h1V3.46l2.77 2.73.73-.69L8.45 2z"/><path d="M12.23 6.26A4.1 4.1 0 0 0 8.5 4a4.11 4.11 0 0 0-3.9 2.78C2.55 7 1 8.58 1 10.5c0 2.21 1.79 4 4 4h7c1.93 0 3.5-1.57 3.5-3.5S14.16 6.55 12.23 6.26zM12 13.5H5c-1.65 0-3-1.35-3-3s1.35-3 3-3c.23 0 .46.03.68.09L6 7.78V8h1v-.93l.3-.06A3.1 3.1 0 0 1 10.38 5a3.07 3.07 0 0 1 2.87 2.22l.25 1.02h1.01c1.38 0 2.5 1.12 2.5 2.5S15.88 13.5 14.5 13.5H12z"/></svg>`,
    save: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M13.85 2.15l-1-1A.49.49 0 0 0 12.5 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2.5a.49.49 0 0 0-.15-.35zM3 2h8v3H3V2zm9 12H4v-5h8v5zm2-6h-1v-1a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v1H2V3h.29L3 3.71V6h8V3.71L11.71 3H14v5z"/></svg>`,
    copy: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 4l.35-.35.35.35H5v11h8V4h.29l.36-.35.35.35V15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4zm2-2l.35-.35.36.35H10v1H6V2zm-1 0h-1v2H3V2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5V4h-1V2H8v1h-.35l-.36-.35-.35.35H6z"/></svg>`,
    trash: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M11 2H9c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1H5c-.55 0-1 .45-1 1v1H3v1h1v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5h1V4h-1V3c0-.55-.45-1-1-1zM8 2h.5l.5.5v.5H7v-.5l.5-.5H8zm3 12H5V5h6v9z"/></svg>`,
    load: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8.45 11h-.9L4 7.5l.72-.69L7.5 9.54V2h1v7.54l2.77-2.73.73.69L8.45 11z"/><path d="M12.23 6.26A4.1 4.1 0 0 0 8.5 4a4.11 4.11 0 0 0-3.9 2.78C2.55 7 1 8.58 1 10.5c0 2.21 1.79 4 4 4h7c1.93 0 3.5-1.57 3.5-3.5S14.16 6.55 12.23 6.26zM12 13.5H5c-1.65 0-3-1.35-3-3s1.35-3 3-3c.23 0 .46.03.68.09L6 7.78V8h1v-.93l.3-.06A3.1 3.1 0 0 1 10.38 5a3.07 3.07 0 0 1 2.87 2.22l.25 1.02h1.01c1.38 0 2.5 1.12 2.5 2.5S15.88 13.5 14.5 13.5H12z"/></svg>`,
    paint: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12.5 1h-9C2.12 1 1 2.12 1 3.5v9C1 13.88 2.12 15 3.5 15h9c1.38 0 2.5-1.12 2.5-2.5v-9C15 2.12 13.88 1 12.5 1zm-9 1C2.95 2 2.5 2.45 2.5 3s.45 1 1 1 1-.45 1-1-.45-1-1-1zm9 12h-9C2.95 14 2.5 13.55 2.5 13V6h11v7c0 .55-.45 1-1 1z"/></svg>`,
    magic: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M7.5 2L8 4l2 .5L8 5l-.5 2L7 5l-2-.5L7 4l.5-2zm6 7l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5zM3.5 9L4 11l2 .5L4 12l-.5 2L3 12l-2-.5L3 11l.5-2z"/></svg>`
};
const TEXTS = {
    dropTitle: "Extraer desde Imagen",
    dropDesc: "Arrastra una imagen o <b>clic para buscar</b>",
    sectionBase: "COLORES BASE",
    sectionAI: "IA ARCHITECT",
    sectionExport: "EXPORTAR CÓDIGO",
    sectionSaved: "PALETAS GUARDADAS",
    placeholderHex: "#Hex",
    btnGenerate: "Generar Paleta",
    btnAI: "Generar con IA",
    placeholderAI: "Ej: Cafetería oscura, Cyberpunk neon...",
    descAI: "Describe tu proyecto:",
    msgGenerate: "Genera una paleta para ver resultados",
    msgProcessing: "Procesando imagen...",
    msgError: "Error: Solo archivos de imagen",
    msgCopied: "¡Código copiado!",
    msgSaved: "¡Paleta guardada!",
};
class LuminaPanel {
    _context;
    static viewType = "luminaCode.sidebarView";
    _view;
    _aiService;
    _colorMath;
    _exportService;
    _storageService;
    _lang = TEXTS;
    constructor(_context) {
        this._context = _context;
        this._aiService = new AIService_1.AIService();
        this._colorMath = new ColorMath_1.ColorMath();
        this._exportService = new ExportService_1.ExportService();
        this._storageService = new StorageService_1.StorageService(_context.globalState);
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._context.extensionUri,
                vscode.Uri.joinPath(this._context.extensionUri, "out"),
                vscode.Uri.joinPath(this._context.extensionUri, "media"),
                vscode.Uri.joinPath(this._context.extensionUri, "node_modules"),
            ],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => {
            // 1. CARGA INICIAL
            if (message.command === "refreshSaved")
                this.sendSavedPalettes(webviewView);
            // 2. GENERAR
            let rawColors = [];
            if (message.command === "generateAI")
                rawColors = this._aiService.generatePalette(message.text);
            else if (message.command === "generateManual")
                rawColors = this._aiService.generateMixed(message.colors);
            if (rawColors.length > 0) {
                const analysis = this._colorMath.analyzePalette(rawColors);
                webviewView.webview.postMessage({ command: "showResults", data: analysis });
            }
            // 3. RESTAURAR (EXACTA)
            if (message.command === "restorePalette") {
                const analysis = this._colorMath.analyzePalette(message.colors);
                webviewView.webview.postMessage({ command: "showResults", data: analysis });
            }
            // 4. PREVIEW / EXPORT
            if (message.command === "requestPreview") {
                const code = this._exportService.generateCode(message.colors, message.format);
                webviewView.webview.postMessage({ command: "updatePreview", code: code });
            }
            // 5. GUARDAR
            if (message.command === "savePalette") {
                const result = this._storageService.savePalette({
                    id: Date.now().toString(),
                    name: message.name || "Mi Paleta",
                    colors: message.colors,
                    date: Date.now()
                }, IS_PRO_USER);
                if (result.success) {
                    vscode.window.showInformationMessage(`Paleta guardada.`);
                    this.sendSavedPalettes(webviewView);
                }
                else {
                    vscode.window.showErrorMessage(result.error || "Error al guardar");
                }
            }
            // 6. BORRAR
            if (message.command === "deletePalette") {
                this._storageService.deletePalette(message.id);
                this.sendSavedPalettes(webviewView);
            }
            if (message.command === "notify")
                vscode.window.showInformationMessage(message.text);
        });
    }
    sendSavedPalettes(webviewView) {
        const saved = this._storageService.getPalettes();
        webviewView.webview.postMessage({ command: "updateSaved", palettes: saved, isPro: IS_PRO_USER });
    }
    _getHtmlForWebview(webview) {
        const toolkitUri = (0, getUri_1.getUri)(webview, this._context.extensionUri, ["node_modules", "@vscode", "webview-ui-toolkit", "dist", "toolkit.js"]);
        const colorThiefUri = (0, getUri_1.getUri)(webview, this._context.extensionUri, ["node_modules", "colorthief", "dist", "color-thief.mjs"]);
        const t = this._lang;
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module" src="${toolkitUri}"></script>
        <style>
          body { padding: 15px; display: flex; flex-direction: column; gap: 20px; font-family: var(--vscode-font-family); }
          
          /* --- MODO DIOS DEL DRAG & DROP --- */
          /* Cuando 'dragging-over' está activo, TODO lo que no sea el cuerpo es intangible */
          /* Esto fuerza a que el drop ocurra siempre en el 'body', sin que los hijos interfieran */
          body.dragging-over * { pointer-events: none !important; }
          
          body.dragging-over {
              background-color: var(--vscode-editor-selectionBackground);
              outline: 2px dashed var(--vscode-focusBorder);
              outline-offset: -5px;
          }
          
          .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; opacity: 0.8; margin-bottom: 8px; }
          .premium-badge { background: linear-gradient(90deg, #ff00cc, #333399); color: white; padding: 2px 6px; border-radius: 4px; font-size: 9px; margin-left: 5px; }
          
          .color-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
          .picker-input { width: 28px; height: 28px; border: none; background: transparent; cursor: pointer; padding: 0; }
          
          /* DROP ZONE */
          #drop-zone-container { position: relative; }
          #drop-zone { 
            border: 2px dashed var(--vscode-input-border); 
            border-radius: 8px; 
            min-height: 120px; 
            display: flex; flex-direction: column; justify-content: center; align-items: center; 
            gap: 10px; color: var(--vscode-descriptionForeground); background: var(--vscode-editor-background); 
            position: relative; cursor: pointer; transition: all 0.2s ease;
          }
          
          /* Los hijos no capturan eventos por defecto para evitar parpadeos */
          #drop-zone * { pointer-events: none; }
          
          #drop-zone:hover { background: var(--vscode-input-background); border-color: var(--vscode-focusBorder); }
          #preview-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.3; display: none; z-index: 0; border-radius: 6px; }
          #drop-zone.has-image .drop-content { z-index: 5; background: rgba(0,0,0,0.6); padding: 8px 15px; border-radius: 20px; backdrop-filter: blur(4px); position: relative; }

          /* UTILS */
          .icon-slot { display: flex; align-items: center; justify-content: center; }
          .icon-slot svg { width: 16px; height: 16px; }

          /* RESULTADOS */
          #score-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; display: none; }
          .score-circle { width: 30px; height: 30px; border-radius: 50%; background: var(--vscode-editor-selectionBackground); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid var(--vscode-focusBorder); }
          #colors-container { display: flex; flex-direction: column; gap: 8px; margin-top: 5px; }
          .color-card { border-radius: 6px; overflow: hidden; border: 1px solid var(--vscode-widget-border); display: flex; flex-direction: column; }
          .color-visual { height: 40px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; cursor: pointer; font-family: monospace; font-size: 13px; font-weight: 600; }
          .color-info { padding: 6px 10px; background: var(--vscode-editor-background); display: flex; justify-content: space-between; align-items: center; font-size: 10px; opacity: 0.9; }
          .badge { padding: 1px 5px; border-radius: 3px; font-weight: bold; }
          .badge-AAA { background: #2da042; color: white; } .badge-AA { background: #d29922; color: black; } .badge-Fail { background: #f85149; color: white; }

          /* EXPORTAR */
          #export-section { display: none; margin-top: 10px; }
          .code-preview-container { position: relative; margin-top: 8px; }
          #code-output { width: 100%; font-family: monospace; font-size: 11px; }
          .copy-btn-absolute { position: absolute; top: 5px; right: 5px; z-index: 10; }

          /* GUARDADOS */
          #saved-section { margin-top: 20px; border-top: 1px solid var(--vscode-widget-border); padding-top: 15px; }
          .saved-item { display: flex; align-items: center; justify-content: space-between; padding: 8px; border: 1px solid var(--vscode-widget-border); margin-bottom: 5px; border-radius: 4px; background: var(--vscode-editor-background); }
          .saved-mini-colors { display: flex; gap: 2px; }
          .mini-box { width: 12px; height: 12px; border-radius: 2px; }
          .saved-actions { display: flex; gap: 5px; }
        </style>
      </head>
      <body>
        
        <div>
            <div class="section-title">${t.dropTitle} <span class="premium-badge">PRO</span></div>
            <div id="drop-zone-container">
                <input type="file" id="hidden-file-input" accept="image/*" style="display: none;">
                <div id="drop-zone">
                    <img id="preview-img" />
                    <div class="drop-content" style="text-align: center;">
                        <span class="icon-slot" style="margin-bottom:5px;">${ICONS.cloudUpload}</span>
                        <p id="drop-text" style="margin: 0; font-size: 11px;">${t.dropDesc}</p>
                    </div>
                </div>
            </div>
        </div>
        <vscode-divider></vscode-divider>

        <div>
          <div class="section-title">${t.sectionBase}</div>
          <div class="color-row"><vscode-text-field id="hex-1" placeholder="${t.placeholderHex}" value="#007acc" style="flex:1;">P</vscode-text-field><input type="color" id="picker-1" class="picker-input" value="#007acc"></div>
          <div class="color-row"><vscode-text-field id="hex-2" placeholder="${t.placeholderHex} (Op)" style="flex:1;">S</vscode-text-field><input type="color" id="picker-2" class="picker-input" value="#ffffff"></div>
          <div class="color-row"><vscode-text-field id="hex-3" placeholder="${t.placeholderHex} (Op)" style="flex:1;">T</vscode-text-field><input type="color" id="picker-3" class="picker-input" value="#ffffff"></div>
          <vscode-button id="btn-manual" appearance="primary" style="width: 100%">
             ${t.btnGenerate}
             <span slot="start" class="icon-slot">${ICONS.paint}</span>
          </vscode-button>
        </div>
        <vscode-divider></vscode-divider>

        <div>
          <div class="section-title">${t.sectionAI} <span class="premium-badge">PRO</span></div>
          <vscode-text-area id="input-ai" resize="vertical" placeholder="${t.placeholderAI}" style="width: 100%; margin-bottom: 10px;"></vscode-text-area>
          <vscode-button id="btn-ai" appearance="secondary" style="width: 100%">
             ${t.btnAI}
             <span slot="start" class="icon-slot">${ICONS.magic}</span>
          </vscode-button>
        </div>
        <vscode-divider></vscode-divider>

        <div>
           <div id="score-header">
              <div class="section-title" style="margin:0">RESULTADOS</div>
              <div style="display:flex; align-items:center; gap:5px;">
                  <span style="font-size:10px; opacity:0.7">Score:</span>
                  <div id="global-score" class="score-circle">--</div>
                  <vscode-button id="btn-save" appearance="secondary" style="margin-left: 10px; padding: 3px 8px;">
                      Guardar <span slot="start" class="icon-slot">${ICONS.save}</span>
                  </vscode-button>
              </div>
           </div>
           
           <div id="colors-container">
              <p style="opacity: 0.5; font-size: 12px; text-align: center; padding: 20px;">${t.msgGenerate}</p>
           </div>
        </div>

        <div id="export-section">
            <vscode-divider></vscode-divider>
            <div class="section-title" style="margin-top: 15px;">${t.sectionExport}</div>
            <vscode-dropdown id="export-format" style="width: 100%;">
                <vscode-option value="css">CSS Variables</vscode-option>
                <vscode-option value="tailwind">Tailwind Config</vscode-option>
                <vscode-option value="scss">SCSS Variables</vscode-option>
                <vscode-option value="json">JSON</vscode-option>
            </vscode-dropdown>
            <div class="code-preview-container">
                <vscode-button id="btn-copy-preview" class="copy-btn-absolute" appearance="icon">
                    <span class="icon-slot">${ICONS.copy}</span>
                </vscode-button>
                <vscode-text-area id="code-output" resize="vertical" rows="8" readonly></vscode-text-area>
            </div>
        </div>

        <div id="saved-section">
            <div class="section-title" style="display:flex; justify-content:space-between;">
                ${t.sectionSaved}
                <span id="limit-indicator" style="font-size: 9px; opacity: 0.6;"></span>
            </div>
            <div id="saved-list">
                <p style="font-size:11px; opacity:0.5;">No hay paletas guardadas.</p>
            </div>
        </div>

        <script type="module">
            import ColorThief from "${colorThiefUri}";
            const vscode = acquireVsCodeApi();
            const colorThief = new ColorThief();
            let currentColors = [];

            window.addEventListener('load', () => { vscode.postMessage({ command: 'refreshSaved' }); });

            // --- DRAG & DROP NUCLEAR V2 (MODO DIOS) ---
            
            // 1. Listeners Globales para el Documento
            // Cuando algo se arrastra sobre la ventana, activamos la clase CSS
            document.addEventListener('dragenter', (e) => {
                e.preventDefault(); e.stopPropagation();
                document.body.classList.add('dragging-over');
            });

            document.addEventListener('dragover', (e) => {
                e.preventDefault(); e.stopPropagation();
                document.body.classList.add('dragging-over');
            });

            document.addEventListener('dragleave', (e) => {
                e.preventDefault(); e.stopPropagation();
                // Solo quitamos la clase si el mouse sale realmente de la ventana
                if (e.clientX === 0 && e.clientY === 0) {
                     document.body.classList.remove('dragging-over');
                }
            });

            // 2. Listener de DROP Global (Atrapa TODO)
            document.addEventListener('drop', (e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                document.body.classList.remove('dragging-over'); // Apagamos highlight

                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                    processFile(files[0]);
                }
            });

            // --- CLICK MANUAL EN ZONA VISUAL ---
            const dropZone = document.getElementById('drop-zone');
            const hiddenInput = document.getElementById('hidden-file-input');
            const imgPreview = document.getElementById('preview-img');
            const dropText = document.getElementById('drop-text');

            dropZone.addEventListener('click', () => hiddenInput.click());
            hiddenInput.addEventListener('change', (e) => processFile(e.target.files[0]));

            // PROCESAMIENTO
            function processFile(file) {
                if(!file || !file.type.startsWith('image/')) return;
                
                dropText.innerHTML = "${t.msgProcessing}"; // Feedback
                dropZone.classList.add('has-image');
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    imgPreview.src = e.target.result;
                    imgPreview.style.display = 'block';
                    imgPreview.onload = () => {
                        try {
                            const p = colorThief.getPalette(imgPreview, 3);
                            if(p) {
                                if(p[0]) updateInput('hex-1', 'picker-1', rgbToHex(p[0]));
                                if(p[1]) updateInput('hex-2', 'picker-2', rgbToHex(p[1]));
                                if(p[2]) updateInput('hex-3', 'picker-3', rgbToHex(p[2]));
                                triggerManual();
                                dropText.innerHTML = "¡Listo!";
                            }
                        } catch(err) { console.error(err); }
                    };
                };
                reader.readAsDataURL(file);
            }

            // SYNC
            function updateInput(hId, pId, val) {
                document.getElementById(hId).value = val;
                document.getElementById(pId).value = val;
            }
            const rgbToHex = ([r, g, b]) => "#" + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
            function setupSync(hId, pId) {
                const h = document.getElementById(hId), p = document.getElementById(pId);
                p.addEventListener('input', e => h.value = e.target.value);
                h.addEventListener('input', e => { if(/^#[0-9A-F]{6}$/i.test(e.target.value)) p.value = e.target.value; });
                h.addEventListener('keydown', e => { if(e.key === 'Enter') triggerManual(); });
            }
            setupSync('hex-1','picker-1'); setupSync('hex-2','picker-2'); setupSync('hex-3','picker-3');

            function triggerManual() {
                const c = ['hex-1','hex-2','hex-3'].map(id => document.getElementById(id).value).filter(v => v);
                vscode.postMessage({ command: 'generateManual', colors: c });
            }
            document.getElementById('btn-manual').addEventListener('click', triggerManual);
            document.getElementById('btn-ai').addEventListener('click', () => {
                vscode.postMessage({ command: 'generateAI', text: document.getElementById('input-ai').value });
            });

            // EXPORT & SAVE
            const exportDropdown = document.getElementById('export-format');
            const codeOutput = document.getElementById('code-output');
            exportDropdown.addEventListener('change', () => { if (currentColors.length > 0) requestPreview(); });
            function requestPreview() {
                vscode.postMessage({ command: 'requestPreview', colors: currentColors, format: exportDropdown.value });
            }
            document.getElementById('btn-copy-preview').addEventListener('click', () => {
                const code = codeOutput.value;
                if(code) { navigator.clipboard.writeText(code); vscode.postMessage({ command: 'notify', text: '${t.msgCopied}' }); }
            });
            document.getElementById('btn-save').addEventListener('click', () => {
                if(currentColors.length === 0) return;
                const name = document.getElementById('input-ai').value || "Paleta Personalizada";
                vscode.postMessage({ command: 'savePalette', colors: currentColors, name: name });
            });
            
            function loadPalette(colors) {
                if(colors[0]) updateInput('hex-1', 'picker-1', colors[0]);
                if(colors[1]) updateInput('hex-2', 'picker-2', colors[1]);
                if(colors[2]) updateInput('hex-3', 'picker-3', colors[2]);
                vscode.postMessage({ command: 'restorePalette', colors: colors });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // MESSAGE HANDLER
            window.addEventListener('message', event => {
                const m = event.data;
                if (m.command === "showResults") {
                    const { metrics, globalScore } = m.data;
                    currentColors = metrics.map(x => x.hex);
                    document.getElementById('score-header').style.display = 'flex';
                    document.getElementById('export-section').style.display = 'block';
                    
                    const scoreCircle = document.getElementById('global-score');
                    scoreCircle.textContent = globalScore;
                    scoreCircle.style.color = globalScore > 70 ? '#4caf50' : (globalScore > 40 ? '#ff9800' : '#f44336');
                    scoreCircle.style.borderColor = scoreCircle.style.color;

                    const container = document.getElementById('colors-container');
                    container.innerHTML = '';
                    metrics.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'color-card';
                        
                        const visual = document.createElement('div');
                        visual.className = 'color-visual';
                        visual.style.backgroundColor = item.hex;
                        visual.style.color = item.bestText;
                        visual.innerHTML = '<span>' + item.hex + '</span>';
                        visual.addEventListener('click', () => {
                             navigator.clipboard.writeText(item.hex);
                             vscode.postMessage({ command: 'notify', text: 'Color ' + item.hex + ' copiado' });
                        });
                        
                        const badgeClass = item.rating.includes('AA') ? (item.rating === 'AAA' ? 'badge-AAA' : 'badge-AA') : 'badge-Fail';
                        const info = document.createElement('div');
                        info.className = 'color-info';
                        info.innerHTML = \`<span>Contrast: <strong>\${item.contrast}:1</strong></span><span class="badge \${badgeClass}">\${item.rating}</span>\`;
                        card.appendChild(visual); card.appendChild(info); container.appendChild(card);
                    });
                    requestPreview();
                }
                
                if (m.command === "updatePreview") { codeOutput.value = m.code; }

                if (m.command === "updateSaved") {
                    const list = document.getElementById('saved-list');
                    const indicator = document.getElementById('limit-indicator');
                    list.innerHTML = '';
                    if (m.isPro) {
                        indicator.textContent = "PRO ILIMITADO"; indicator.style.color = "#ff00cc";
                    } else {
                        indicator.textContent = \`\${m.palettes.length} / 5 SLOTS (FREE)\`;
                        indicator.style.color = m.palettes.length >= 5 ? "#f44336" : "inherit";
                    }
                    if (m.palettes.length === 0) {
                        list.innerHTML = '<p style="font-size:11px; opacity:0.5;">No hay paletas guardadas.</p>';
                        return;
                    }
                    m.palettes.forEach(p => {
                        const item = document.createElement('div');
                        item.className = 'saved-item';
                        let colorStrip = '';
                        p.colors.slice(0, 5).forEach(c => { colorStrip += \`<div class="mini-box" style="background:\${c}"></div>\`; });
                        item.innerHTML = \`<div style="flex:1"><div style="font-size:11px; font-weight:bold; margin-bottom:3px;">\${p.name}</div><div class="saved-mini-colors">\${colorStrip}</div></div>\`;
                        const actions = document.createElement('div');
                        actions.className = 'saved-actions';
                        
                        const btnLoad = document.createElement('vscode-button');
                        btnLoad.appearance = 'icon'; 
                        btnLoad.innerHTML = '<span class="icon-slot">${ICONS.load}</span>';
                        btnLoad.addEventListener('click', () => loadPalette(p.colors));

                        const btnDel = document.createElement('vscode-button');
                        btnDel.appearance = 'icon'; 
                        btnDel.innerHTML = '<span class="icon-slot">${ICONS.trash}</span>';
                        btnDel.addEventListener('click', () => { vscode.postMessage({ command: 'deletePalette', id: p.id }); });
                        
                        actions.appendChild(btnLoad); actions.appendChild(btnDel); item.appendChild(actions); list.appendChild(item);
                    });
                }
            });
        </script>
      </body>
      </html>
    `;
    }
}
exports.LuminaPanel = LuminaPanel;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUri = getUri;
const vscode_1 = __webpack_require__(1);
function getUri(webview, extensionUri, pathList) {
    return webview.asWebviewUri(vscode_1.Uri.joinPath(extensionUri, ...pathList));
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AIService = void 0;
const tinycolor_1 = __webpack_require__(5);
// ==========================================
// 1. DICCIONARIO DE TONOS (Definen el color base)
// ==========================================
// Mapea palabras -> Rango de Hue (0-360)
const HUE_DICTIONARY = {
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
const MOD_DICTIONARY = {
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
class AIService {
    generatePalette(prompt) {
        const text = this.normalizeText(prompt);
        // --- PASO 1: DETECTAR INTENCIÓN ---
        let targetHue = null;
        let targetSat = this.randomInt(40, 70);
        let targetVal = this.randomInt(50, 90);
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
                if (mod.sat)
                    targetSat = this.randomInt(mod.sat[0], mod.sat[1]);
                if (mod.val)
                    targetVal = this.randomInt(mod.val[0], mod.val[1]);
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
        const baseColor = new tinycolor_1.TinyColor({ h: targetHue, s: targetSat, v: targetVal });
        // --- PASO 4: ESTRATEGIA DE ARMONÍA ---
        let palette = [];
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
                palette.push(new tinycolor_1.TinyColor(palette[0]).lighten(randomInt(10, 20)).toHexString());
            }
        }
        else {
            // Análoga es la "vieja confiable" para diseño web standard
            palette = baseColor.analogous(5).map(c => c.toHexString());
        }
        // Recortar a 5 por si acaso
        return palette.slice(0, 5);
    }
    generateMixed(colors) {
        // Filtramos colores inválidos
        const validColors = colors.filter(c => new tinycolor_1.TinyColor(c).isValid);
        if (validColors.length === 0)
            return this.generateFromHex("#000000"); // Fallback
        // Si solo hay uno, usamos la lógica anterior
        if (validColors.length === 1) {
            return this.generateFromHex(validColors[0]);
        }
        // Si hay varios (2 o 3), los respetamos y rellenamos el resto
        let palette = [...validColors];
        const base = new tinycolor_1.TinyColor(validColors[0]);
        // Rellenamos hasta tener 5 colores
        while (palette.length < 5) {
            // Estrategia: Buscar colores que conecten los existentes o complementarios suaves
            const nextColor = base.analogous(7)[palette.length].toHexString();
            palette.push(nextColor);
        }
        return palette.slice(0, 5);
    }
    generateFromHex(hex) {
        const base = new tinycolor_1.TinyColor(hex);
        if (!base.isValid)
            return ["#000000", "#ffffff"]; // Fallback por si acaso
        // Usamos una tríada complementaria split para asegurar variedad pero armonía
        // Esto genera: Base, Contraste 1, Contraste 2.
        let palette = base.splitcomplement().map(c => c.toHexString());
        // Si TinyColor devuelve menos de 5 (a veces pasa), rellenamos
        while (palette.length < 5) {
            palette.push(new tinycolor_1.TinyColor(palette[0]).lighten(randomInt(10, 30)).toHexString());
        }
        return palette.slice(0, 5);
    }
    normalizeText(text) {
        return text.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar tildes
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""); // Quitar puntuación
    }
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.AIService = AIService;
// Helper suelto por si se necesita fuera
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TinyColor: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor),
/* harmony export */   bounds: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_6__.bounds),
/* harmony export */   cmykToRgb: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.cmykToRgb),
/* harmony export */   convertDecimalToHex: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.convertDecimalToHex),
/* harmony export */   convertHexToDecimal: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.convertHexToDecimal),
/* harmony export */   fromRatio: () => (/* reexport safe */ _from_ratio_js__WEBPACK_IMPORTED_MODULE_4__.fromRatio),
/* harmony export */   hslToRgb: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.hslToRgb),
/* harmony export */   hsvToRgb: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.hsvToRgb),
/* harmony export */   inputToRGB: () => (/* reexport safe */ _format_input_js__WEBPACK_IMPORTED_MODULE_5__.inputToRGB),
/* harmony export */   isReadable: () => (/* reexport safe */ _readability_js__WEBPACK_IMPORTED_MODULE_2__.isReadable),
/* harmony export */   isValidCSSUnit: () => (/* reexport safe */ _format_input_js__WEBPACK_IMPORTED_MODULE_5__.isValidCSSUnit),
/* harmony export */   legacyRandom: () => (/* reexport safe */ _from_ratio_js__WEBPACK_IMPORTED_MODULE_4__.legacyRandom),
/* harmony export */   mostReadable: () => (/* reexport safe */ _readability_js__WEBPACK_IMPORTED_MODULE_2__.mostReadable),
/* harmony export */   names: () => (/* reexport safe */ _css_color_names_js__WEBPACK_IMPORTED_MODULE_1__.names),
/* harmony export */   numberInputToObject: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.numberInputToObject),
/* harmony export */   parseIntFromHex: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.parseIntFromHex),
/* harmony export */   random: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_6__.random),
/* harmony export */   readability: () => (/* reexport safe */ _readability_js__WEBPACK_IMPORTED_MODULE_2__.readability),
/* harmony export */   rgbToCmyk: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.rgbToCmyk),
/* harmony export */   rgbToHex: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHex),
/* harmony export */   rgbToHsl: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHsl),
/* harmony export */   rgbToHsv: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHsv),
/* harmony export */   rgbToRgb: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.rgbToRgb),
/* harmony export */   rgbaToArgbHex: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.rgbaToArgbHex),
/* harmony export */   rgbaToHex: () => (/* reexport safe */ _conversion_js__WEBPACK_IMPORTED_MODULE_7__.rgbaToHex),
/* harmony export */   stringInputToObject: () => (/* reexport safe */ _format_input_js__WEBPACK_IMPORTED_MODULE_5__.stringInputToObject),
/* harmony export */   toMsFilter: () => (/* reexport safe */ _to_ms_filter_js__WEBPACK_IMPORTED_MODULE_3__.toMsFilter)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _css_color_names_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _readability_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _to_ms_filter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _from_ratio_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var _format_input_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(14);
/* harmony import */ var _conversion_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7);











/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TinyColor: () => (/* binding */ TinyColor)
/* harmony export */ });
/* harmony import */ var _conversion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _css_color_names_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _format_input_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);




class TinyColor {
    constructor(color = '', opts = {}) {
        // If input is already a tinycolor, return itself
        if (color instanceof TinyColor) {
            // eslint-disable-next-line no-constructor-return
            return color;
        }
        if (typeof color === 'number') {
            color = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.numberInputToObject)(color);
        }
        this.originalInput = color;
        const rgb = (0,_format_input_js__WEBPACK_IMPORTED_MODULE_2__.inputToRGB)(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = opts.format ?? rgb.format;
        this.gradientType = opts.gradientType;
        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this.r < 1) {
            this.r = Math.round(this.r);
        }
        if (this.g < 1) {
            this.g = Math.round(this.g);
        }
        if (this.b < 1) {
            this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
    }
    isDark() {
        return this.getBrightness() < 128;
    }
    isLight() {
        return !this.isDark();
    }
    /**
     * Returns the perceived brightness of the color, from 0-255.
     */
    getBrightness() {
        // http://www.w3.org/TR/AERT#color-contrast
        const rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    }
    /**
     * Returns the perceived luminance of a color, from 0-1.
     */
    getLuminance() {
        // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        const rgb = this.toRgb();
        let R;
        let G;
        let B;
        const RsRGB = rgb.r / 255;
        const GsRGB = rgb.g / 255;
        const BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    /**
     * Returns the alpha value of a color, from 0-1.
     */
    getAlpha() {
        return this.a;
    }
    /**
     * Sets the alpha value on the current color.
     *
     * @param alpha - The new alpha value. The accepted range is 0-1.
     */
    setAlpha(alpha) {
        this.a = (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.boundAlpha)(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
    }
    /**
     * Returns whether the color is monochrome.
     */
    isMonochrome() {
        const { s } = this.toHsl();
        return s === 0;
    }
    /**
     * Returns the object as a HSVA object.
     */
    toHsv() {
        const hsv = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHsv)(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    }
    /**
     * Returns the hsva values interpolated into a string with the following format:
     * "hsva(xxx, xxx, xxx, xx)".
     */
    toHsvString() {
        const hsv = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHsv)(this.r, this.g, this.b);
        const h = Math.round(hsv.h * 360);
        const s = Math.round(hsv.s * 100);
        const v = Math.round(hsv.v * 100);
        return this.a === 1 ? `hsv(${h}, ${s}%, ${v}%)` : `hsva(${h}, ${s}%, ${v}%, ${this.roundA})`;
    }
    /**
     * Returns the object as a HSLA object.
     */
    toHsl() {
        const hsl = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHsl)(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    }
    /**
     * Returns the hsla values interpolated into a string with the following format:
     * "hsla(xxx, xxx, xxx, xx)".
     */
    toHslString() {
        const hsl = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHsl)(this.r, this.g, this.b);
        const h = Math.round(hsl.h * 360);
        const s = Math.round(hsl.s * 100);
        const l = Math.round(hsl.l * 100);
        return this.a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${this.roundA})`;
    }
    /**
     * Returns the hex value of the color.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    toHex(allow3Char = false) {
        return (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHex)(this.r, this.g, this.b, allow3Char);
    }
    /**
     * Returns the hex value of the color -with a # prefixed.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    toHexString(allow3Char = false) {
        return '#' + this.toHex(allow3Char);
    }
    /**
     * Returns the hex 8 value of the color.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    toHex8(allow4Char = false) {
        return (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbaToHex)(this.r, this.g, this.b, this.a, allow4Char);
    }
    /**
     * Returns the hex 8 value of the color -with a # prefixed.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    toHex8String(allow4Char = false) {
        return '#' + this.toHex8(allow4Char);
    }
    /**
     * Returns the shorter hex value of the color depends on its alpha -with a # prefixed.
     * @param allowShortChar will shorten hex value to 3 or 4 char if possible
     */
    toHexShortString(allowShortChar = false) {
        return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    }
    /**
     * Returns the object as a RGBA object.
     */
    toRgb() {
        return {
            r: Math.round(this.r),
            g: Math.round(this.g),
            b: Math.round(this.b),
            a: this.a,
        };
    }
    /**
     * Returns the RGBA values interpolated into a string with the following format:
     * "RGBA(xxx, xxx, xxx, xx)".
     */
    toRgbString() {
        const r = Math.round(this.r);
        const g = Math.round(this.g);
        const b = Math.round(this.b);
        return this.a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${this.roundA})`;
    }
    /**
     * Returns the object as a RGBA object.
     */
    toPercentageRgb() {
        const fmt = (x) => `${Math.round((0,_util_js__WEBPACK_IMPORTED_MODULE_3__.bound01)(x, 255) * 100)}%`;
        return {
            r: fmt(this.r),
            g: fmt(this.g),
            b: fmt(this.b),
            a: this.a,
        };
    }
    /**
     * Returns the RGBA relative values interpolated into a string
     */
    toPercentageRgbString() {
        const rnd = (x) => Math.round((0,_util_js__WEBPACK_IMPORTED_MODULE_3__.bound01)(x, 255) * 100);
        return this.a === 1
            ? `rgb(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%)`
            : `rgba(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%, ${this.roundA})`;
    }
    toCmyk() {
        return {
            ...(0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToCmyk)(this.r, this.g, this.b),
        };
    }
    toCmykString() {
        const { c, m, y, k } = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToCmyk)(this.r, this.g, this.b);
        return `cmyk(${c}, ${m}, ${y}, ${k})`;
    }
    /**
     * The 'real' name of the color -if there is one.
     */
    toName() {
        if (this.a === 0) {
            return 'transparent';
        }
        if (this.a < 1) {
            return false;
        }
        const hex = '#' + (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToHex)(this.r, this.g, this.b, false);
        for (const [key, value] of Object.entries(_css_color_names_js__WEBPACK_IMPORTED_MODULE_1__.names)) {
            if (hex === value) {
                return key;
            }
        }
        return false;
    }
    toString(format) {
        const formatSet = Boolean(format);
        format = format ?? this.format;
        let formattedString = false;
        const hasAlpha = this.a < 1 && this.a >= 0;
        const needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === 'name' && this.a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === 'rgb') {
            formattedString = this.toRgbString();
        }
        if (format === 'prgb') {
            formattedString = this.toPercentageRgbString();
        }
        if (format === 'hex' || format === 'hex6') {
            formattedString = this.toHexString();
        }
        if (format === 'hex3') {
            formattedString = this.toHexString(true);
        }
        if (format === 'hex4') {
            formattedString = this.toHex8String(true);
        }
        if (format === 'hex8') {
            formattedString = this.toHex8String();
        }
        if (format === 'name') {
            formattedString = this.toName();
        }
        if (format === 'hsl') {
            formattedString = this.toHslString();
        }
        if (format === 'hsv') {
            formattedString = this.toHsvString();
        }
        if (format === 'cmyk') {
            formattedString = this.toCmykString();
        }
        return formattedString || this.toHexString();
    }
    toNumber() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }
    clone() {
        return new TinyColor(this.toString());
    }
    /**
     * Lighten the color a given amount. Providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    lighten(amount = 10) {
        const hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.clamp01)(hsl.l);
        return new TinyColor(hsl);
    }
    /**
     * Brighten the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    brighten(amount = 10) {
        const rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor(rgb);
    }
    /**
     * Darken the color a given amount, from 0 to 100.
     * Providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    darken(amount = 10) {
        const hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.clamp01)(hsl.l);
        return new TinyColor(hsl);
    }
    /**
     * Mix the color with pure white, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    tint(amount = 10) {
        return this.mix('white', amount);
    }
    /**
     * Mix the color with pure black, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    shade(amount = 10) {
        return this.mix('black', amount);
    }
    /**
     * Desaturate the color a given amount, from 0 to 100.
     * Providing 100 will is the same as calling greyscale
     * @param amount - valid between 1-100
     */
    desaturate(amount = 10) {
        const hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.clamp01)(hsl.s);
        return new TinyColor(hsl);
    }
    /**
     * Saturate the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    saturate(amount = 10) {
        const hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.clamp01)(hsl.s);
        return new TinyColor(hsl);
    }
    /**
     * Completely desaturates a color into greyscale.
     * Same as calling `desaturate(100)`
     */
    greyscale() {
        return this.desaturate(100);
    }
    /**
     * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
     * Values outside of this range will be wrapped into this range.
     */
    spin(amount) {
        const hsl = this.toHsl();
        const hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor(hsl);
    }
    /**
     * Mix the current color a given amount with another color, from 0 to 100.
     * 0 means no mixing (return current color).
     */
    mix(color, amount = 50) {
        const rgb1 = this.toRgb();
        const rgb2 = new TinyColor(color).toRgb();
        const p = amount / 100;
        const rgba = {
            r: (rgb2.r - rgb1.r) * p + rgb1.r,
            g: (rgb2.g - rgb1.g) * p + rgb1.g,
            b: (rgb2.b - rgb1.b) * p + rgb1.b,
            a: (rgb2.a - rgb1.a) * p + rgb1.a,
        };
        return new TinyColor(rgba);
    }
    analogous(results = 6, slices = 30) {
        const hsl = this.toHsl();
        const part = 360 / slices;
        const ret = [this];
        for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(new TinyColor(hsl));
        }
        return ret;
    }
    /**
     * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
     */
    complement() {
        const hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor(hsl);
    }
    monochromatic(results = 6) {
        const hsv = this.toHsv();
        const { h } = hsv;
        const { s } = hsv;
        let { v } = hsv;
        const res = [];
        const modification = 1 / results;
        while (results--) {
            res.push(new TinyColor({ h, s, v }));
            v = (v + modification) % 1;
        }
        return res;
    }
    splitcomplement() {
        const hsl = this.toHsl();
        const { h } = hsl;
        return [
            this,
            new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
            new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
        ];
    }
    /**
     * Compute how the color would appear on a background
     */
    onBackground(background) {
        const fg = this.toRgb();
        const bg = new TinyColor(background).toRgb();
        const alpha = fg.a + bg.a * (1 - fg.a);
        return new TinyColor({
            r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
            g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
            b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
            a: alpha,
        });
    }
    /**
     * Alias for `polyad(3)`
     */
    triad() {
        return this.polyad(3);
    }
    /**
     * Alias for `polyad(4)`
     */
    tetrad() {
        return this.polyad(4);
    }
    /**
     * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
     * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
     */
    polyad(n) {
        const hsl = this.toHsl();
        const { h } = hsl;
        const result = [this];
        const increment = 360 / n;
        for (let i = 1; i < n; i++) {
            result.push(new TinyColor({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
    }
    /**
     * compare color vs current color
     */
    equals(color) {
        const comparedColor = new TinyColor(color);
        /**
         * RGB and CMYK do not have the same color gamut, so a CMYK conversion will never be 100%.
         * This means we need to compare CMYK to CMYK to ensure accuracy of the equals function.
         */
        if (this.format === 'cmyk' || comparedColor.format === 'cmyk') {
            return this.toCmykString() === comparedColor.toCmykString();
        }
        return this.toRgbString() === comparedColor.toRgbString();
    }
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cmykToRgb: () => (/* binding */ cmykToRgb),
/* harmony export */   convertDecimalToHex: () => (/* binding */ convertDecimalToHex),
/* harmony export */   convertHexToDecimal: () => (/* binding */ convertHexToDecimal),
/* harmony export */   hslToRgb: () => (/* binding */ hslToRgb),
/* harmony export */   hsvToRgb: () => (/* binding */ hsvToRgb),
/* harmony export */   numberInputToObject: () => (/* binding */ numberInputToObject),
/* harmony export */   parseIntFromHex: () => (/* binding */ parseIntFromHex),
/* harmony export */   rgbToCmyk: () => (/* binding */ rgbToCmyk),
/* harmony export */   rgbToHex: () => (/* binding */ rgbToHex),
/* harmony export */   rgbToHsl: () => (/* binding */ rgbToHsl),
/* harmony export */   rgbToHsv: () => (/* binding */ rgbToHsv),
/* harmony export */   rgbToRgb: () => (/* binding */ rgbToRgb),
/* harmony export */   rgbaToArgbHex: () => (/* binding */ rgbaToArgbHex),
/* harmony export */   rgbaToHex: () => (/* binding */ rgbaToHex)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */
function rgbToRgb(r, g, b) {
    return {
        r: (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(r, 255) * 255,
        g: (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(g, 255) * 255,
        b: (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(b, 255) * 255,
    };
}
/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]
 */
function rgbToHsl(r, g, b) {
    r = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(r, 255);
    g = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(g, 255);
    b = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max === min) {
        s = 0;
        h = 0; // achromatic
    }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                break;
        }
        h /= 6;
    }
    return { h, s, l };
}
function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}
/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hslToRgb(h, s, l) {
    let r;
    let g;
    let b;
    h = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(h, 360);
    s = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(s, 100);
    l = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(l, 100);
    if (s === 0) {
        // achromatic
        g = l;
        b = l;
        r = l;
    }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]
 */
function rgbToHsv(r, g, b) {
    r = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(r, 255);
    g = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(g, 255);
    b = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0; // achromatic
    }
    else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                break;
        }
        h /= 6;
    }
    return { h, s, v };
}
/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hsvToRgb(h, s, v) {
    h = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(h, 360) * 6;
    s = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(s, 100);
    v = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.bound01)(v, 100);
    const i = Math.floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color to hex
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255]
 * *Returns:* a 3 or 6 character hex
 */
function rgbToHex(r, g, b, allow3Char) {
    const hex = [
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(r).toString(16)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(g).toString(16)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(b).toString(16)),
    ];
    // Return a 3 character hex if possible
    if (allow3Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join('');
}
/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * *Assumes:* r, g, b are contained in the set [0, 255] and a in [0, 1]
 * *Returns:* a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params
function rgbaToHex(r, g, b, a, allow4Char) {
    const hex = [
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(r).toString(16)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(g).toString(16)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(b).toString(16)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(convertDecimalToHex(a)),
    ];
    // Return a 4 character hex if possible
    if (allow4Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1)) &&
        hex[3].startsWith(hex[3].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join('');
}
/**
 * Converts an RGBA color to an ARGB Hex8 string
 * Rarely used, but required for "toFilter()"
 *
 * *Assumes:* r, g, b are contained in the set [0, 255] and a in [0, 1]
 * *Returns:* a 8 character argb hex
 */
function rgbaToArgbHex(r, g, b, a) {
    const hex = [
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(convertDecimalToHex(a)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(r).toString(16)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(g).toString(16)),
        (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.pad2)(Math.round(b).toString(16)),
    ];
    return hex.join('');
}
/**
 * Converts CMYK to RBG
 * Assumes c, m, y, k are in the set [0, 100]
 */
function cmykToRgb(c, m, y, k) {
    const cConv = c / 100;
    const mConv = m / 100;
    const yConv = y / 100;
    const kConv = k / 100;
    const r = 255 * (1 - cConv) * (1 - kConv);
    const g = 255 * (1 - mConv) * (1 - kConv);
    const b = 255 * (1 - yConv) * (1 - kConv);
    return { r, g, b };
}
function rgbToCmyk(r, g, b) {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, m, y);
    if (k === 1) {
        c = 0;
        m = 0;
        y = 0;
    }
    else {
        c = ((c - k) / (1 - k)) * 100;
        m = ((m - k) / (1 - k)) * 100;
        y = ((y - k) / (1 - k)) * 100;
    }
    k *= 100;
    return {
        c: Math.round(c),
        m: Math.round(m),
        y: Math.round(y),
        k: Math.round(k),
    };
}
/** Converts a decimal to a hex value */
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */
function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */
function parseIntFromHex(val) {
    return parseInt(val, 16);
}
function numberInputToObject(color) {
    return {
        r: color >> 16,
        g: (color & 0xff00) >> 8,
        b: color & 0xff,
    };
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bound01: () => (/* binding */ bound01),
/* harmony export */   boundAlpha: () => (/* binding */ boundAlpha),
/* harmony export */   clamp01: () => (/* binding */ clamp01),
/* harmony export */   convertToPercentage: () => (/* binding */ convertToPercentage),
/* harmony export */   isOnePointZero: () => (/* binding */ isOnePointZero),
/* harmony export */   isPercentage: () => (/* binding */ isPercentage),
/* harmony export */   pad2: () => (/* binding */ pad2)
/* harmony export */ });
/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
function bound01(n, max) {
    if (isOnePointZero(n)) {
        n = '100%';
    }
    const isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    // Automatically convert percentage into number
    if (isPercent) {
        n = parseInt(String(n * max), 10) / 100;
    }
    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }
    // Convert into [0, 1] range if it isn't already
    if (max === 360) {
        // If n is a hue given in degrees,
        // wrap around out-of-range values into [0, 360] range
        // then convert into [0, 1].
        n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
    }
    else {
        // If n not a hue given in degrees
        // Convert into [0, 1] range if it isn't already.
        n = (n % max) / parseFloat(String(max));
    }
    return n;
}
/**
 * Force a number between 0 and 1
 * @hidden
 */
function clamp01(val) {
    return Math.min(1, Math.max(0, val));
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
function isOnePointZero(n) {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}
/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
function isPercentage(n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
}
/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */
function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }
    return a;
}
/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
function convertToPercentage(n) {
    if (Number(n) <= 1) {
        return `${Number(n) * 100}%`;
    }
    return n;
}
/**
 * Force a hex value to have 2 characters
 * @hidden
 */
function pad2(c) {
    return c.length === 1 ? '0' + c : String(c);
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   names: () => (/* binding */ names)
/* harmony export */ });
// https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
/**
 * @hidden
 */
const names = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    goldenrod: '#daa520',
    gold: '#ffd700',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavenderblush: '#fff0f5',
    lavender: '#e6e6fa',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inputToRGB: () => (/* binding */ inputToRGB),
/* harmony export */   isValidCSSUnit: () => (/* binding */ isValidCSSUnit),
/* harmony export */   stringInputToObject: () => (/* binding */ stringInputToObject)
/* harmony export */ });
/* harmony import */ var _conversion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _css_color_names_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);



/**
 * Given a string or object, convert that input to RGB
 *
 * Possible string inputs:
 * ```
 * "red"
 * "#f00" or "f00"
 * "#ff0000" or "ff0000"
 * "#ff000000" or "ff000000"
 * "rgb 255 0 0" or "rgb (255, 0, 0)"
 * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
 * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
 * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
 * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
 * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
 * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
 * "cmyk(0, 20, 0, 0)" or "cmyk 0 20 0 0"
 * ```
 */
function inputToRGB(color) {
    let rgb = { r: 0, g: 0, b: 0 };
    let a = 1;
    let s = null;
    let v = null;
    let l = null;
    let ok = false;
    let format = false;
    if (typeof color === 'string') {
        color = stringInputToObject(color);
    }
    if (typeof color === 'object') {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbToRgb)(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.convertToPercentage)(color.s);
            v = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.convertToPercentage)(color.v);
            rgb = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.hsvToRgb)(color.h, s, v);
            ok = true;
            format = 'hsv';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.convertToPercentage)(color.s);
            l = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.convertToPercentage)(color.l);
            rgb = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.hslToRgb)(color.h, s, l);
            ok = true;
            format = 'hsl';
        }
        else if (isValidCSSUnit(color.c) &&
            isValidCSSUnit(color.m) &&
            isValidCSSUnit(color.y) &&
            isValidCSSUnit(color.k)) {
            rgb = (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.cmykToRgb)(color.c, color.m, color.y, color.k);
            ok = true;
            format = 'cmyk';
        }
        if (Object.prototype.hasOwnProperty.call(color, 'a')) {
            a = color.a;
        }
    }
    a = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.boundAlpha)(a);
    return {
        ok,
        format: color.format || format,
        r: Math.min(255, Math.max(rgb.r, 0)),
        g: Math.min(255, Math.max(rgb.g, 0)),
        b: Math.min(255, Math.max(rgb.b, 0)),
        a,
    };
}
// <http://www.w3.org/TR/css3-values/#integers>
const CSS_INTEGER = '[-\\+]?\\d+%?';
// <http://www.w3.org/TR/css3-values/#number-value>
const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
const CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')';
// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
// eslint-disable-next-line prettier/prettier
const PERMISSIVE_MATCH3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
const PERMISSIVE_MATCH4 = 
// eslint-disable-next-line prettier/prettier
'[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
const matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
    rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
    hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
    hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
    hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
    hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
    cmyk: new RegExp('cmyk' + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}` or `{c, m, y, k}` or `{c, m, y, k, a}`
 */
function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
        return false;
    }
    let named = false;
    if (_css_color_names_js__WEBPACK_IMPORTED_MODULE_1__.names[color]) {
        color = _css_color_names_js__WEBPACK_IMPORTED_MODULE_1__.names[color];
        named = true;
    }
    else if (color === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
    }
    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    let match = matchers.rgb.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.cmyk.exec(color);
    if (match) {
        return {
            c: match[1],
            m: match[2],
            y: match[3],
            k: match[4],
        };
    }
    match = matchers.hex8.exec(color);
    if (match) {
        return {
            r: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[1]),
            g: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[2]),
            b: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[3]),
            a: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.convertHexToDecimal)(match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[1]),
            g: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[2]),
            b: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    match = matchers.hex4.exec(color);
    if (match) {
        return {
            r: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[1] + match[1]),
            g: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[2] + match[2]),
            b: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[3] + match[3]),
            a: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.convertHexToDecimal)(match[4] + match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[1] + match[1]),
            g: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[2] + match[2]),
            b: (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.parseIntFromHex)(match[3] + match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    return false;
}
/**
 * Check to see if it looks like a CSS unit
 * (see `matchers` above for definition).
 */
function isValidCSSUnit(color) {
    if (typeof color === 'number') {
        return !Number.isNaN(color);
    }
    return matchers.CSS_UNIT.test(color);
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isReadable: () => (/* binding */ isReadable),
/* harmony export */   mostReadable: () => (/* binding */ mostReadable),
/* harmony export */   readability: () => (/* binding */ readability)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);

// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
/**
 * AKA `contrast`
 *
 * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
 */
function readability(color1, color2) {
    const c1 = new _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor(color1);
    const c2 = new _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor(color2);
    return ((Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) /
        (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05));
}
/**
 * Ensure that foreground and background color combinations meet WCAG2 guidelines.
 * The third argument is an object.
 *      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
 *      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
 * If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
 *
 * Example
 * ```ts
 * new TinyColor().isReadable('#000', '#111') => false
 * new TinyColor().isReadable('#000', '#111', { level: 'AA', size: 'large' }) => false
 * ```
 */
function isReadable(color1, color2, wcag2 = { level: 'AA', size: 'small' }) {
    const readabilityLevel = readability(color1, color2);
    switch ((wcag2.level ?? 'AA') + (wcag2.size ?? 'small')) {
        case 'AAsmall':
        case 'AAAlarge':
            return readabilityLevel >= 4.5;
        case 'AAlarge':
            return readabilityLevel >= 3;
        case 'AAAsmall':
            return readabilityLevel >= 7;
        default:
            return false;
    }
}
/**
 * Given a base color and a list of possible foreground or background
 * colors for that base, returns the most readable color.
 * Optionally returns Black or White if the most readable color is unreadable.
 *
 * @param baseColor - the base color.
 * @param colorList - array of colors to pick the most readable one from.
 * @param args - and object with extra arguments
 *
 * Example
 * ```ts
 * new TinyColor().mostReadable('#123', ['#124", "#125'], { includeFallbackColors: false }).toHexString(); // "#112255"
 * new TinyColor().mostReadable('#123', ['#124", "#125'],{ includeFallbackColors: true }).toHexString();  // "#ffffff"
 * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'large' }).toHexString(); // "#faf3f3"
 * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'small' }).toHexString(); // "#ffffff"
 * ```
 */
function mostReadable(baseColor, colorList, args = { includeFallbackColors: false, level: 'AA', size: 'small' }) {
    let bestColor = null;
    let bestScore = 0;
    const { includeFallbackColors, level, size } = args;
    for (const color of colorList) {
        const score = readability(baseColor, color);
        if (score > bestScore) {
            bestScore = score;
            bestColor = new _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor(color);
        }
    }
    if (isReadable(baseColor, bestColor, { level, size }) || !includeFallbackColors) {
        return bestColor;
    }
    args.includeFallbackColors = false;
    return mostReadable(baseColor, ['#fff', '#000'], args);
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toMsFilter: () => (/* binding */ toMsFilter)
/* harmony export */ });
/* harmony import */ var _conversion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


/**
 * Returns the color represented as a Microsoft filter for use in old versions of IE.
 */
function toMsFilter(firstColor, secondColor) {
    const color = new _index_js__WEBPACK_IMPORTED_MODULE_1__.TinyColor(firstColor);
    const hex8String = '#' + (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbaToArgbHex)(color.r, color.g, color.b, color.a);
    let secondHex8String = hex8String;
    const gradientType = color.gradientType ? 'GradientType = 1, ' : '';
    if (secondColor) {
        const s = new _index_js__WEBPACK_IMPORTED_MODULE_1__.TinyColor(secondColor);
        secondHex8String = '#' + (0,_conversion_js__WEBPACK_IMPORTED_MODULE_0__.rgbaToArgbHex)(s.r, s.g, s.b, s.a);
    }
    return `progid:DXImageTransform.Microsoft.gradient(${gradientType}startColorstr=${hex8String},endColorstr=${secondHex8String})`;
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromRatio: () => (/* binding */ fromRatio),
/* harmony export */   legacyRandom: () => (/* binding */ legacyRandom)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);


/**
 * If input is an object, force 1 into "1.0" to handle ratios properly
 * String input requires "1.0" as input, so 1 will be treated as 1
 */
function fromRatio(ratio, opts) {
    const newColor = {
        r: (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.convertToPercentage)(ratio.r),
        g: (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.convertToPercentage)(ratio.g),
        b: (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.convertToPercentage)(ratio.b),
    };
    if (ratio.a !== undefined) {
        newColor.a = Number(ratio.a);
    }
    return new _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor(newColor, opts);
}
/** old random function */
function legacyRandom() {
    return new _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor({
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
    });
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bounds: () => (/* binding */ bounds),
/* harmony export */   random: () => (/* binding */ random)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

function random(options = {}) {
    // Check if we need to generate multiple colors
    if (options.count !== undefined &&
        options.count !== null) {
        const totalColors = options.count;
        const colors = [];
        options.count = undefined;
        while (totalColors > colors.length) {
            // Since we're generating multiple colors,
            // incremement the seed. Otherwise we'd just
            // generate the same color each time...
            options.count = null;
            if (options.seed) {
                options.seed += 1;
            }
            colors.push(random(options));
        }
        options.count = totalColors;
        return colors;
    }
    // First we pick a hue (H)
    const h = pickHue(options.hue, options.seed);
    // Then use H to determine saturation (S)
    const s = pickSaturation(h, options);
    // Then use S and H to determine brightness (B).
    const v = pickBrightness(h, s, options);
    const res = { h, s, v };
    if (options.alpha !== undefined) {
        res.a = options.alpha;
    }
    // Then we return the HSB color in the desired format
    return new _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor(res);
}
function pickHue(hue, seed) {
    const hueRange = getHueRange(hue);
    let res = randomWithin(hueRange, seed);
    // Instead of storing red as two seperate ranges,
    // we group them, using negative numbers
    if (res < 0) {
        res = 360 + res;
    }
    return res;
}
function pickSaturation(hue, options) {
    if (options.hue === 'monochrome') {
        return 0;
    }
    if (options.luminosity === 'random') {
        return randomWithin([0, 100], options.seed);
    }
    const { saturationRange } = getColorInfo(hue);
    let sMin = saturationRange[0];
    let sMax = saturationRange[1];
    switch (options.luminosity) {
        case 'bright':
            sMin = 55;
            break;
        case 'dark':
            sMin = sMax - 10;
            break;
        case 'light':
            sMax = 55;
            break;
        default:
            break;
    }
    return randomWithin([sMin, sMax], options.seed);
}
function pickBrightness(H, S, options) {
    let bMin = getMinimumBrightness(H, S);
    let bMax = 100;
    switch (options.luminosity) {
        case 'dark':
            bMax = bMin + 20;
            break;
        case 'light':
            bMin = (bMax + bMin) / 2;
            break;
        case 'random':
            bMin = 0;
            bMax = 100;
            break;
        default:
            break;
    }
    return randomWithin([bMin, bMax], options.seed);
}
function getMinimumBrightness(H, S) {
    const { lowerBounds } = getColorInfo(H);
    for (let i = 0; i < lowerBounds.length - 1; i++) {
        const s1 = lowerBounds[i][0];
        const v1 = lowerBounds[i][1];
        const s2 = lowerBounds[i + 1][0];
        const v2 = lowerBounds[i + 1][1];
        if (S >= s1 && S <= s2) {
            const m = (v2 - v1) / (s2 - s1);
            const b = v1 - m * s1;
            return m * S + b;
        }
    }
    return 0;
}
function getHueRange(colorInput) {
    const num = parseInt(colorInput, 10);
    if (!Number.isNaN(num) && num < 360 && num > 0) {
        return [num, num];
    }
    if (typeof colorInput === 'string') {
        const namedColor = bounds.find(n => n.name === colorInput);
        if (namedColor) {
            const color = defineColor(namedColor);
            if (color.hueRange) {
                return color.hueRange;
            }
        }
        const parsed = new _index_js__WEBPACK_IMPORTED_MODULE_0__.TinyColor(colorInput);
        if (parsed.isValid) {
            const hue = parsed.toHsv().h;
            return [hue, hue];
        }
    }
    return [0, 360];
}
function getColorInfo(hue) {
    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
        hue -= 360;
    }
    for (const bound of bounds) {
        const color = defineColor(bound);
        if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
            return color;
        }
    }
    throw Error('Color not found');
}
function randomWithin(range, seed) {
    if (seed === undefined) {
        return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
    }
    // Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    const max = range[1] || 1;
    const min = range[0] || 0;
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280.0;
    return Math.floor(min + rnd * (max - min));
}
function defineColor(bound) {
    const sMin = bound.lowerBounds[0][0];
    const sMax = bound.lowerBounds[bound.lowerBounds.length - 1][0];
    const bMin = bound.lowerBounds[bound.lowerBounds.length - 1][1];
    const bMax = bound.lowerBounds[0][1];
    return {
        name: bound.name,
        hueRange: bound.hueRange,
        lowerBounds: bound.lowerBounds,
        saturationRange: [sMin, sMax],
        brightnessRange: [bMin, bMax],
    };
}
/**
 * @hidden
 */
const bounds = [
    {
        name: 'monochrome',
        hueRange: null,
        lowerBounds: [
            [0, 0],
            [100, 0],
        ],
    },
    {
        name: 'red',
        hueRange: [-26, 18],
        lowerBounds: [
            [20, 100],
            [30, 92],
            [40, 89],
            [50, 85],
            [60, 78],
            [70, 70],
            [80, 60],
            [90, 55],
            [100, 50],
        ],
    },
    {
        name: 'orange',
        hueRange: [19, 46],
        lowerBounds: [
            [20, 100],
            [30, 93],
            [40, 88],
            [50, 86],
            [60, 85],
            [70, 70],
            [100, 70],
        ],
    },
    {
        name: 'yellow',
        hueRange: [47, 62],
        lowerBounds: [
            [25, 100],
            [40, 94],
            [50, 89],
            [60, 86],
            [70, 84],
            [80, 82],
            [90, 80],
            [100, 75],
        ],
    },
    {
        name: 'green',
        hueRange: [63, 178],
        lowerBounds: [
            [30, 100],
            [40, 90],
            [50, 85],
            [60, 81],
            [70, 74],
            [80, 64],
            [90, 50],
            [100, 40],
        ],
    },
    {
        name: 'blue',
        hueRange: [179, 257],
        lowerBounds: [
            [20, 100],
            [30, 86],
            [40, 80],
            [50, 74],
            [60, 60],
            [70, 52],
            [80, 44],
            [90, 39],
            [100, 35],
        ],
    },
    {
        name: 'purple',
        hueRange: [258, 282],
        lowerBounds: [
            [20, 100],
            [30, 87],
            [40, 79],
            [50, 70],
            [60, 65],
            [70, 59],
            [80, 52],
            [90, 45],
            [100, 42],
        ],
    },
    {
        name: 'pink',
        hueRange: [283, 334],
        lowerBounds: [
            [20, 100],
            [30, 90],
            [40, 86],
            [60, 84],
            [80, 80],
            [90, 75],
            [100, 73],
        ],
    },
];


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColorMath = void 0;
const tinycolor_1 = __webpack_require__(5);
class ColorMath {
    /**
     * Analiza una lista de colores y devuelve métricas de accesibilidad
     */
    analyzePalette(colors) {
        const metrics = colors.map(hex => this.analyzeColor(hex));
        // Calculamos el promedio para el "Lumina Score" global
        const totalScore = metrics.reduce((acc, curr) => acc + curr.score, 0);
        const globalScore = Math.round(totalScore / metrics.length);
        return { metrics, globalScore };
    }
    analyzeColor(hex) {
        const color = new tinycolor_1.TinyColor(hex);
        // 1. ¿Contra qué se lee mejor? (Blanco o Negro)
        const whiteContrast = (0, tinycolor_1.readability)(color, "#ffffff");
        const blackContrast = (0, tinycolor_1.readability)(color, "#000000");
        const bestText = whiteContrast > blackContrast ? "#ffffff" : "#000000";
        const maxContrast = Math.max(whiteContrast, blackContrast);
        // 2. Determinar WCAG Rating
        let rating = "Fail";
        let score = 50; // Base score
        if (maxContrast >= 7) {
            rating = "AAA";
            score = 100;
        }
        else if (maxContrast >= 4.5) {
            rating = "AA";
            score = 85;
        }
        else if (maxContrast >= 3) {
            rating = "AA+"; // AA Large Text
            score = 70;
        }
        else {
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
exports.ColorMath = ColorMath;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExportService = void 0;
class ExportService {
    generateCode(colors, format) {
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
    toCSS(colors) {
        return `:root {\n` +
            colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') +
            `\n}`;
    }
    toSCSS(colors) {
        return colors.map((c, i) => `$color-${i + 1}: ${c};`).join('\n');
    }
    toTailwind(colors) {
        return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n` +
            colors.map((c, i) => `        'brand-${i + 1}': '${c}',`).join('\n') +
            `\n      }\n    }\n  }\n}`;
    }
}
exports.ExportService = ExportService;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StorageService = void 0;
class StorageService {
    _storage;
    static KEY = "lumina_saved_palettes";
    constructor(_storage) {
        this._storage = _storage;
    }
    getPalettes() {
        return this._storage.get(StorageService.KEY, []);
    }
    savePalette(palette, isPro) {
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
    deletePalette(id) {
        const current = this.getPalettes();
        const updated = current.filter(p => p.id !== id);
        this._storage.update(StorageService.KEY, updated);
        return updated;
    }
}
exports.StorageService = StorageService;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map