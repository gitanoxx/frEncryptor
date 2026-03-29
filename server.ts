import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import JavaScriptObfuscator from "javascript-obfuscator";

// Python Obfuscation/Encryption
function processPython(code: string, mode: 'obfuscate' | 'encrypt'): string {
  if (mode === 'encrypt') {
    const b64 = Buffer.from(code).toString('base64');
    const noise = Array.from({ length: 15 }, () => `_${Math.random().toString(36).substring(2, 7)} = None`).join('\n');
    return `
import base64 as _b64
${noise}
_payload = "${b64}"
exec(_b64.b64decode(_payload).decode('utf-8'))
`.trim();
  } else {
    // Simple obfuscation: replace some common patterns or just add comments
    return `# Ofuscado por frEncryptor\nimport base64\nexec(base64.b64decode("${Buffer.from(code).toString('base64')}"))`;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Endpoints
  app.post("/api/obfuscate", (req, res) => {
    const { code, options } = req.body;
    const { language, mode } = options || {};
    
    if (!code) {
      return res.status(400).json({ error: "No se proporcionó código" });
    }

    try {
      if (language === 'python') {
        return res.json({ 
          obfuscatedCode: processPython(code, mode)
        });
      }

      const obfuscationConfig: any = {
        compact: true,
        controlFlowFlattening: mode === 'encrypt',
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: mode === 'encrypt',
        simplify: true,
        stringArray: true,
        stringArrayThreshold: 1,
        ...options
      };

      if (mode === 'encrypt') {
        obfuscationConfig.splitStrings = true;
        obfuscationConfig.unicodeEscapeSequence = true;
      }

      const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationConfig);

      res.json({ 
        obfuscatedCode: obfuscationResult.getObfuscatedCode()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error en el procesamiento" });
    }
  });

  // Static Assets & SPA Fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
