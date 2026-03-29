export type SupportedLanguage = 'javascript' | 'python';
export type ProcessingMode = 'obfuscate' | 'encrypt';

export interface ObfuscationOptions {
  compact?: boolean;
  controlFlowFlattening?: boolean;
  deadCodeInjection?: boolean;
  debugProtection?: boolean;
  disableConsoleOutput?: boolean;
  selfDefending?: boolean;
  splitStrings?: boolean;
  stringArray?: boolean;
  language: SupportedLanguage;
  mode: ProcessingMode;
}

export async function obfuscateCode(code: string, options: ObfuscationOptions): Promise<{ obfuscatedCode: string }> {
  const response = await fetch('/api/obfuscate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, options }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Obfuscation failed');
  }

  const data = await response.json();
  return {
    obfuscatedCode: data.obfuscatedCode
  };
}
