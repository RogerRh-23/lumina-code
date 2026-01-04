import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { AIService } from "../services/AIService";
import { ColorMath } from "../services/ColorMath";
import { ExportService } from "../services/ExportService";
import { StorageService } from "../services/StorageService";

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

export class LuminaPanel implements vscode.WebviewViewProvider {
  public static readonly viewType = "luminaCode.sidebarView";
  private _view?: vscode.WebviewView;
  private _aiService: AIService;
  private _colorMath: ColorMath;
  private _exportService: ExportService;
  private _storageService: StorageService;
  private _lang = TEXTS;

  constructor(private readonly _context: vscode.ExtensionContext) {
    this._aiService = new AIService();
    this._colorMath = new ColorMath();
    this._exportService = new ExportService();
    this._storageService = new StorageService(_context.globalState);
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
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
      if (message.command === "refreshSaved") this.sendSavedPalettes(webviewView);

      // 2. GENERAR
      let rawColors: string[] = [];
      if (message.command === "generateAI") rawColors = this._aiService.generatePalette(message.text);
      else if (message.command === "generateManual") rawColors = this._aiService.generateMixed(message.colors);

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
        } else {
          vscode.window.showErrorMessage(result.error || "Error al guardar");
        }
      }

      // 6. BORRAR
      if (message.command === "deletePalette") {
        this._storageService.deletePalette(message.id);
        this.sendSavedPalettes(webviewView);
      }

      if (message.command === "notify") vscode.window.showInformationMessage(message.text);
    });
  }

  private sendSavedPalettes(webviewView: vscode.WebviewView) {
    const saved = this._storageService.getPalettes();
    webviewView.webview.postMessage({ command: "updateSaved", palettes: saved, isPro: IS_PRO_USER });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const toolkitUri = getUri(webview, this._context.extensionUri, ["node_modules", "@vscode", "webview-ui-toolkit", "dist", "toolkit.js"]);
    const colorThiefUri = getUri(webview, this._context.extensionUri, ["node_modules", "colorthief", "dist", "color-thief.mjs"]);
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