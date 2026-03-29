import React, { useState } from 'react';
import { 
  Shield, 
  Zap,
  Code,
  Copy,
  Check,
  AlertCircle,
  Settings,
  Download,
  Trash2,
  Lock,
  EyeOff,
  Cpu,
  Fingerprint,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { obfuscateCode, ObfuscationOptions, SupportedLanguage, ProcessingMode } from './services/obfuscationService';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = useState<'main' | 'privacy' | 'terms'>('main');
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [processingMode, setProcessingMode] = useState<ProcessingMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<ObfuscationOptions>({
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    selfDefending: true,
    splitStrings: true,
    stringArray: true,
    language: 'javascript',
    mode: 'obfuscate',
  });

  const handleProcess = async (mode: ProcessingMode) => {
    if (!inputCode.trim()) return;
    
    setProcessingMode(mode);
    setError(null);
    
    const currentOptions = { ...options, mode };
    setOptions(currentOptions);
    
    try {
      const { obfuscatedCode } = await obfuscateCode(inputCode, currentOptions);
      setOutputCode(obfuscatedCode);
    } catch (err: any) {
      setError(err.message || "Error en el procesamiento");
    } finally {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setProcessingMode(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isPython = options.language === 'python';
    const blob = new Blob([outputCode], { type: isPython ? 'text/x-python' : 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isPython ? 'protegido.py' : 'protegido.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleOption = (key: keyof ObfuscationOptions) => {
    if (key === 'language' || key === 'mode') return;
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0a051a] text-fuchsia-400 font-mono selection:bg-fuchsia-500 selection:text-white relative overflow-x-hidden">
      {/* UI Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full" />
        <div className="scanline opacity-10" />
      </div>

      <header className="border-b border-fuchsia-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500/10 rounded-lg border border-fuchsia-500/30">
              <Fingerprint className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">frEncryptor</h1>
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300">
              <Cpu className="w-3 h-3 animate-pulse" />
              <span>NÚCLEO: V5.0</span>
            </div>
            <a 
              href="https://github.com/gitanoxx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Desarrollado por fr</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8 relative z-10">
        {view === 'main' ? (
          <>
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-gradient-x">
                  PROTEGE TU CÓDIGO
                </h2>
              </motion.div>
              <p className="text-indigo-200/60 max-w-2xl mx-auto text-sm uppercase tracking-widest font-medium">
                Ofuscación y encriptación avanzada para JavaScript y Python. Seguridad de nivel industrial.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-black/40 border border-fuchsia-500/20 backdrop-blur-md p-6 rounded-2xl space-y-6 shadow-2xl shadow-fuchsia-500/5">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white">
                    <Settings className="w-4 h-4 text-fuchsia-500" /> Configuración
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Lenguaje de Origen</label>
                      <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        {(['javascript', 'python'] as SupportedLanguage[]).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setOptions(prev => ({ ...prev, language: lang }))}
                            className={cn(
                              "py-2 text-[10px] uppercase tracking-tighter transition-all rounded-lg font-bold",
                              options.language === lang 
                                ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20" 
                                : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {lang === 'javascript' ? 'JS / TS' : 'Python'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent" />

                    <div className="space-y-4">
                      <OptionToggle 
                        label="Compactar" 
                        description="Código en una sola línea"
                        active={!!options.compact} 
                        onToggle={() => toggleOption('compact')} 
                      />
                      <OptionToggle 
                        label="Autodefensa" 
                        description="Evita el formateo del código"
                        active={!!options.selfDefending} 
                        onToggle={() => toggleOption('selfDefending')} 
                      />
                      <OptionToggle 
                        label="Dividir Strings" 
                        description="Fragmenta cadenas de texto"
                        active={!!options.splitStrings} 
                        onToggle={() => toggleOption('splitStrings')} 
                      />
                      <OptionToggle 
                        label="Protección Debug" 
                        description="Bloquea herramientas de dev"
                        active={!!options.debugProtection} 
                        onToggle={() => toggleOption('debugProtection')} 
                      />
                    </div>

                    <div className="space-y-3 pt-4">
                      <button 
                        onClick={() => handleProcess('obfuscate')}
                        disabled={processingMode !== null || !inputCode.trim()}
                        className="w-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-black py-4 rounded-xl hover:bg-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
                      >
                        {processingMode === 'obfuscate' ? (
                          <Zap className="w-5 h-5 animate-spin" />
                        ) : (
                          <Code className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}
                        <span className="uppercase text-xs tracking-widest">{processingMode === 'obfuscate' ? 'Procesando...' : 'Ofuscar Código'}</span>
                      </button>

                      <button 
                        onClick={() => handleProcess('encrypt')}
                        disabled={processingMode !== null || !inputCode.trim()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-xl shadow-fuchsia-600/20"
                      >
                        {processingMode === 'encrypt' ? (
                          <Zap className="w-5 h-5 animate-spin" />
                        ) : (
                          <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="uppercase text-xs tracking-widest">{processingMode === 'encrypt' ? 'Procesando...' : 'Encriptar Código'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-[10px] text-red-400 uppercase leading-tight font-bold">{error}</p>
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-widest font-black text-indigo-300 flex items-center gap-2">
                        <Code className="w-3 h-3" /> Código Fuente
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setInputCode('');
                        setOutputCode('');
                      }}
                      className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Limpiar
                    </button>
                  </div>
                  <div className="bg-black/40 border border-indigo-500/20 backdrop-blur-md rounded-2xl h-[600px] relative overflow-hidden group focus-within:border-indigo-500/50 transition-colors shadow-2xl">
                    <textarea
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder={options.language === 'python' ? "# Pega tu código Python aquí..." : "// Pega tu código JavaScript aquí..."}
                      className="w-full h-full bg-transparent p-8 outline-none resize-none text-xs font-mono text-indigo-100 placeholder:text-indigo-500/30 leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-fuchsia-300 flex items-center gap-2">
                      <EyeOff className="w-3 h-3" /> Resultado Protegido
                    </span>
                    <div className="flex gap-4">
                      <button 
                        onClick={handleCopy}
                        disabled={!outputCode}
                        className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-fuchsia-400 transition-colors flex items-center gap-1 disabled:opacity-10"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                      <button 
                        onClick={handleDownload}
                        disabled={!outputCode}
                        className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-fuchsia-400 transition-colors flex items-center gap-1 disabled:opacity-10"
                      >
                        <Download className="w-3 h-3" /> Descargar
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/60 border border-fuchsia-500/20 backdrop-blur-md rounded-2xl h-[600px] relative overflow-hidden shadow-2xl">
                    <textarea
                      readOnly
                      value={outputCode}
                      placeholder="// El código protegido aparecerá aquí..."
                      className="w-full h-full bg-transparent p-8 outline-none resize-none text-xs font-mono text-fuchsia-200 placeholder:text-fuchsia-500/20 leading-relaxed"
                    />
                    <AnimatePresence>
                      {processingMode !== null && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-20 p-8"
                        >
                          <div className="text-center space-y-8">
                            <div className="relative">
                              <Zap className={cn("w-20 h-20 animate-pulse mx-auto", processingMode === 'obfuscate' ? "text-indigo-500" : "text-fuchsia-500")} />
                              <div className={cn("absolute inset-0 blur-3xl opacity-30 animate-pulse", processingMode === 'obfuscate' ? "bg-indigo-500" : "bg-fuchsia-500")} />
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-sm uppercase tracking-[0.5em] font-black text-white animate-pulse">
                                  {processingMode === 'obfuscate' ? 'Procesando Ofuscación' : 'Procesando Encriptación'}
                                </p>
                                <p className={cn("text-[10px] uppercase tracking-widest", processingMode === 'obfuscate' ? "text-indigo-500/60" : "text-fuchsia-500/60")}>
                                  {processingMode === 'obfuscate' ? 'Protegiendo lógica de código...' : 'Encriptando capas de datos...'}
                                </p>
                              </div>
                              
                              <div className={cn("h-px bg-gradient-to-r from-transparent to-transparent w-48 mx-auto", processingMode === 'obfuscate' ? "via-indigo-500/30" : "via-fuchsia-500/30")} />
                              
                              <div className="space-y-3">
                                <p className="text-[9px] text-indigo-300/40 uppercase tracking-widest">Mientras esperas, visita mi perfil:</p>
                                <a 
                                  href="https://github.com/gitanoxx" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={cn("inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white transition-all group", processingMode === 'obfuscate' ? "hover:bg-indigo-500/20 hover:border-indigo-500/50" : "hover:bg-fuchsia-500/20 hover:border-fuchsia-500/50")}
                                >
                                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  <span className="font-bold">@gitanoxx</span>
                                </a>
                                <p className={cn("text-[8px] uppercase tracking-tighter animate-bounce", processingMode === 'obfuscate' ? "text-indigo-400/60" : "text-fuchsia-400/60")}>¡Se agradece el follow! ❤️</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : view === 'privacy' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto cyber-card space-y-8"
          >
            <div className="flex items-center gap-4 border-b border-fuchsia-500/20 pb-6">
              <Shield className="w-8 h-8 text-fuchsia-500" />
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Política de Privacidad</h2>
            </div>
            <div className="space-y-6 text-indigo-200/80 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Compromiso de No Almacenamiento</h3>
                <p>En frEncryptor, tu privacidad es nuestra prioridad absoluta. Queremos ser claros: **no almacenamos, registramos ni guardamos tu código fuente** en ningún momento. Todo el procesamiento se realiza en tiempo real y los datos se eliminan de la memoria inmediatamente después de completar la operación.</p>
              </section>
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Seguridad de Datos</h3>
                <p>Las comunicaciones entre tu navegador y nuestros servidores están protegidas mediante cifrado SSL/TLS de grado industrial. Esto garantiza que tu código no pueda ser interceptado durante el proceso de envío y recepción.</p>
              </section>
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Cookies y Seguimiento</h3>
                <p>No utilizamos cookies de seguimiento, píxeles de marketing ni herramientas de análisis de terceros que puedan comprometer tu anonimato. Esta aplicación ha sido diseñada para ser una herramienta pura y funcional.</p>
              </section>
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Terceros</h3>
                <p>No compartimos, vendemos ni cedemos ningún tipo de información a terceros. La herramienta es totalmente independiente y autofinanciada.</p>
              </section>
            </div>
            <button 
              onClick={() => setView('main')}
              className="bg-fuchsia-500 text-white font-black px-8 py-3 rounded-xl hover:scale-105 transition-all uppercase text-xs tracking-widest"
            >
              Volver al Inicio
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto cyber-card space-y-8"
          >
            <div className="flex items-center gap-4 border-b border-fuchsia-500/20 pb-6">
              <Lock className="w-8 h-8 text-fuchsia-500" />
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Términos de Uso</h2>
            </div>
            <div className="space-y-6 text-indigo-200/80 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Responsabilidad del Usuario</h3>
                <p>fr no se hace responsable del uso que se le dé a esta aplicación. frEncryptor ha sido creado exclusivamente con **fines éticos, educativos y de protección de propiedad intelectual legítima**.</p>
              </section>
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Misión y Acceso Libre</h3>
                <p>Esta es una aplicación **sin fines de lucro** que busca desarrollar de manera abierta herramientas de seguridad para el libre acceso de la comunidad. Nuestro objetivo es democratizar la protección de software.</p>
              </section>
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Uso Ético</h3>
                <p>El usuario es el único responsable de cumplir con las leyes locales e internacionales al utilizar el código protegido. Queda terminantemente prohibido el uso de esta herramienta para ocultar código malicioso, malware o cualquier actividad que infrinja la ley o los derechos de terceros.</p>
              </section>
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Sin Garantías</h3>
                <p>Aunque nos esforzamos por ofrecer la mejor tecnología de ofuscación, frEncryptor se proporciona "tal cual", sin garantías de que el código sea 100% indescifrable ante ataques de ingeniería inversa extremadamente avanzados.</p>
              </section>
              <section className="space-y-2">
                <h3 className="text-fuchsia-400 font-bold uppercase text-sm tracking-widest">Modificaciones</h3>
                <p>Nos reservamos el derecho de modificar o suspender el servicio en cualquier momento sin previo aviso, con el fin de mejorar la seguridad o funcionalidad de la plataforma.</p>
              </section>
            </div>
            <button 
              onClick={() => setView('main')}
              className="bg-fuchsia-500 text-white font-black px-8 py-3 rounded-xl hover:scale-105 transition-all uppercase text-xs tracking-widest"
            >
              Volver al Inicio
            </button>
          </motion.div>
        )}
      </main>

      <footer className="border-t border-white/5 py-12 mt-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-widest font-bold text-white/30">
          <div className="flex items-center gap-4">
            <Fingerprint className="w-4 h-4" />
            <p>© 2026 frWebScan ®</p>
          </div>
          <div className="flex gap-8">
            <button 
              onClick={() => setView('privacy')}
              className="hover:text-fuchsia-400 transition-colors"
            >
              Privacidad
            </button>
            <button 
              onClick={() => setView('terms')}
              className="hover:text-fuchsia-400 transition-colors"
            >
              Términos
            </button>
            <a 
              href="https://github.com/gitanoxx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-500/60 hover:text-fuchsia-400 transition-colors"
            >
              Github: @gitanoxx
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OptionToggle({ label, description, active, onToggle }: { 
  label: string, 
  description: string, 
  active: boolean, 
  onToggle: () => void 
}) {
  return (
    <button 
      onClick={onToggle}
      className="w-full text-left group"
    >
      <div className="flex justify-between items-center mb-1">
        <span className={cn("text-[11px] font-black uppercase tracking-tighter transition-colors", active ? "text-fuchsia-400" : "text-white/20")}>
          {label}
        </span>
        <div className={cn(
          "w-10 h-5 rounded-full relative transition-all duration-300 border",
          active ? "bg-fuchsia-500/20 border-fuchsia-500/50" : "bg-white/5 border-white/10"
        )}>
          <div className={cn(
            "absolute top-1 w-[10px] h-[10px] rounded-full transition-all duration-300 shadow-lg",
            active ? "left-6 bg-fuchsia-400 shadow-fuchsia-500/50" : "left-1 bg-white/20"
          )} />
        </div>
      </div>
      <p className="text-[9px] font-bold opacity-30 group-hover:opacity-50 transition-opacity uppercase tracking-tighter">{description}</p>
    </button>
  );
}
