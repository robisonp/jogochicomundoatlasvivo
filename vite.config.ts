import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Lista os áudios gravados pela família em public/vozes/<pessoa>/ (lili-001.m4a, ...), para o jogo saber
 * quais falas têm gravação sem precisar testar arquivo por arquivo. Exposto como `virtual:vozes`.
 */
function vozesGravadas(): Plugin {
  const id = 'virtual:vozes';
  const listar = () => {
    const raiz = path.resolve(__dirname, 'public/vozes');
    if (!fs.existsSync(raiz)) return [];
    const lista: string[] = [];
    for (const pessoa of fs.readdirSync(raiz)) {
      const pasta = path.join(raiz, pessoa);
      if (!fs.statSync(pasta).isDirectory()) continue;
      for (const f of fs.readdirSync(pasta)) if (/\.(m4a|mp3|ogg|opus|oga|wav|webm|aac)$/i.test(f)) lista.push(`vozes/${pessoa}/${f}`);
    }
    return lista.sort();
  };
  return {
    name: 'vozes-gravadas',
    resolveId: (i) => (i === id ? '\0' + id : null),
    load: (i) => (i === '\0' + id ? `export default ${JSON.stringify(listar())};` : null),
  };
}

// base relativa: o mesmo build funciona no GitHub Pages (subpasta) e em qualquer hospedagem estática.
export default defineConfig({
  base: './',
  plugins: [vozesGravadas()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
  },
});
