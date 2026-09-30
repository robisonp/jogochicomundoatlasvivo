// Mapa-múndi desenhado por código (contornos simplificados, projeção plana), para a tela do mapa.
import Phaser from 'phaser';
import { tex, rrect, OUTLINE, AMERICA_DO_SUL, AFRICA, AUSTRALIA, TASMANIA, GROENLANDIA, ISLANDIA, SVALBARD, ARQUIPELAGO_CANADA } from './Textures';

/** Tamanho do mapa em pixels e faixa de latitudes mostrada. */
export const MAPA = { largura: 1200, altura: 540, latTopo: 84, latBase: -78 };

export function lonLatParaMapa(lon: number, lat: number): [number, number] {
  return [((lon + 180) / 360) * MAPA.largura, ((MAPA.latTopo - lat) / (MAPA.latTopo - MAPA.latBase)) * MAPA.altura];
}

type Poly = [number, number][];

const AMERICA_NORTE: Poly = [
  [-168, 66], [-162, 70], [-150, 71], [-140, 70], [-128, 70], [-115, 68.5], [-100, 68], [-95, 72], [-85, 70], [-80, 73],
  [-75, 72], [-70, 67], [-64, 60], [-60, 55], [-56, 52], [-60, 47], [-66, 45], [-70, 42], [-74, 40], [-76, 35],
  [-81, 31], [-80, 26], [-82, 25], [-83, 29], [-89, 30], [-94, 29], [-97, 26], [-97, 22], [-94, 18.5], [-90, 21],
  [-87, 21], [-88, 16], [-84, 15], [-83, 11], [-79, 9], [-77, 8], [-80, 7], [-83, 8.5], [-86, 11], [-88, 13],
  [-92, 14.5], [-95, 16], [-100, 17], [-105, 20], [-110, 24], [-114, 31], [-118, 34], [-121, 36], [-124, 40],
  [-124, 46], [-125, 49], [-130, 54], [-135, 58], [-140, 60], [-147, 61], [-153, 58], [-158, 56], [-163, 55],
  [-165, 60], [-167, 64],
];
const EURASIA: Poly = [
  [-9, 39], [-9, 43], [-2, 43.5], [-1, 46], [-4, 48], [-1.5, 49.5], [2, 51], [5, 53], [8, 54], [8, 57], [10.5, 57.5],
  [10.5, 54.5], [14, 54], [20, 54.5], [21, 57], [24, 57.5], [23, 60], [30, 60], [25, 60.2], [21, 61], [22, 63.5],
  [25, 65.5], [22, 65.8], [18, 63], [17, 61], [18.5, 60], [16, 56], [12.5, 56], [11, 59], [8, 58], [5, 59], [5, 62],
  [14, 68], [25, 71], [40, 68], [44, 68], [60, 69.5], [70, 73], [80, 73], [100, 77.5], [115, 74], [130, 72],
  [140, 72.5], [160, 70], [170, 69.5], [180, 66], [180, 65], [175, 62], [165, 60], [163, 57], [156, 51], [157, 58],
  [150, 59.5], [142, 59], [137, 54], [141, 52], [140, 48], [135, 43], [130, 42.5], [129, 35], [126, 35], [126, 38],
  [122, 40], [119, 39], [122, 37], [119, 35], [121, 32], [122, 30], [120, 26], [117, 23], [110, 21], [108, 19],
  [106, 20], [107, 17], [109, 12], [105, 9], [103, 10.5], [101, 13], [100, 8], [103, 1.5], [101, 3], [98.5, 8],
  [98, 13], [97, 17], [94, 16], [92, 21], [89, 22], [87, 21], [85, 19.5], [82, 17], [80, 15], [80, 10], [77, 8],
  [76, 10], [74, 15], [73, 20], [70, 22], [67, 24.5], [62, 25], [57, 25.7], [56.5, 27], [52, 27.5], [50, 30],
  [48, 30], [50, 26], [51, 24.5], [56, 24], [56.5, 22.5], [59.5, 22.5], [55, 17], [52, 16.3], [45, 13], [43, 13],
  [43, 15], [40, 20], [39, 22], [35, 28], [34, 28], [32.5, 30], [34, 31.3], [35, 33], [36, 36], [32, 36.5], [28, 36.8],
  [26, 38], [26, 40], [29, 41], [31, 41.2], [28, 41.5], [26, 40.8], [24, 40], [22.5, 40.5], [23, 38], [22, 37],
  [21, 38.5], [19.5, 41], [19, 42], [16, 43.5], [13.5, 45.7], [12.3, 45.4], [12.5, 44], [14, 42.5], [16, 41.5],
  [18.5, 40.2], [16, 38], [15.7, 40], [12, 42], [10.5, 43], [8.8, 44.4], [7, 43.7], [4, 43.5], [3, 42], [0, 40],
  [0, 38.5], [-2, 36.7], [-5.5, 36], [-7, 37], [-9, 37],
];
const ILHAS: Poly[] = [
  // Grã-Bretanha e Irlanda
  [[-5.5, 50], [1.5, 51], [1.7, 52.8], [0, 53.5], [-1.5, 55], [-3, 56], [-2, 57.7], [-4, 58.6], [-5.5, 58], [-6, 56.5], [-5, 54.8], [-3.5, 54.5], [-3, 53.4], [-4.8, 52.8], [-5.3, 51.7]],
  [[-10, 51.6], [-6, 52], [-6, 54], [-7.5, 55.3], [-10, 54]],
  // Japão
  [[130, 31], [132, 34], [135.5, 34], [140, 35], [141, 38], [142, 41], [140, 41.5], [139.5, 38], [136, 36.5], [132, 35.5], [130, 33.5]],
  [[140, 42], [145.5, 43.5], [142, 45.5], [141, 43]],
  // Sumatra, Bornéu, Java, Nova Guiné, Filipinas
  [[95, 5.5], [98.5, 3.7], [104, -1.5], [106, -5.8], [102, -4], [99, 0]],
  [[109, 1.5], [110, -2], [114, -4], [116.5, -3.5], [118.5, 1], [117.5, 4], [116, 6.5], [113.5, 3.5]],
  [[105.5, -6], [114.5, -7.7], [106, -7.4]],
  [[131, -1.5], [137, -2], [141, -2.6], [146, -5], [150, -10.5], [143, -9], [138, -8], [135, -4.5], [132, -4]],
  [[120, 18.5], [122, 18.5], [124, 13], [126, 8], [125.5, 6], [122, 7], [120, 14]],
  // Madagascar e Nova Zelândia
  [[44, -25], [47, -25], [49.5, -15.5], [49.3, -12], [47, -15.5], [44, -17], [43.5, -22]],
  [[172.7, -34.5], [178.5, -37.7], [176, -41.5], [174.5, -41.3], [173, -40.5], [168, -46.5], [166.5, -45.5], [172, -41], [174, -38]],
];

const ANTARTIDA: Poly = [
  [-57, -63.5], [-60, -64], [-62, -65.5], [-64, -67], [-66, -68.5], [-68, -70.5], [-72, -71], [-76, -72.5], [-90, -73],
  [-100, -74], [-110, -74.5], [-120, -74], [-130, -74.5], [-140, -76], [-150, -77], [-160, -78.5], [-170, -78.5],
  [180, -78], [170, -76.5], [165, -72], [160, -70], [150, -68.5], [140, -66.5], [130, -66], [120, -66.5], [110, -66],
  [100, -66], [90, -66.5], [80, -68], [70, -68.5], [70, -72.5], [65, -67.5], [55, -66.5], [45, -67.5], [35, -69.5],
  [25, -70.5], [15, -70], [5, -70.5], [-5, -71], [-15, -72.5], [-25, -75], [-35, -77.5], [-45, -78], [-55, -75],
  [-60, -72], [-62, -69], [-60, -66], [-58, -64.5],
];

/** Mapinhas das fichas do Atlas para os bichos do mar e da Antártica. */
function mapinhas(scene: Phaser.Scene) {
  const terras: Poly[] = [AMERICA_NORTE, AMERICA_DO_SUL, EURASIA, AFRICA, AUSTRALIA, TASMANIA, ARQUIPELAGO_CANADA, ISLANDIA, SVALBARD, GROENLANDIA, ...ILHAS];
  // Mundo inteiro pequeno: oceanos em destaque (orca, jubarte) ou só os mares do sul (albatroz)
  const mundo = (key: string, destaque: 'oceanos' | 'sul' | 'tropicos') =>
    tex(scene, key, 220, 112, (c, w, h) => {
      const sx = w / MAPA.largura;
      const sy = h / MAPA.altura;
      const poli = (pts: Poly) => {
        c.beginPath();
        pts.forEach(([lon, lat], i) => {
          const [x, y] = lonLatParaMapa(lon, lat);
          if (i === 0) c.moveTo(x * sx, y * sy);
          else c.lineTo(x * sx, y * sy);
        });
        c.closePath();
      };
      c.fillStyle = destaque === 'oceanos' ? '#f2a93b' : '#cfe6f2';
      rrect(c, 1, 1, w - 2, h - 2, 8);
      c.fill();
      if (destaque === 'sul') {
        const [, y] = lonLatParaMapa(0, -32);
        c.fillStyle = '#f2a93b';
        c.fillRect(1, y * sy, w - 2, h - y * sy - 1);
      }
      if (destaque === 'tropicos') {
        // mares quentes: faixa entre os trópicos
        const [, y1] = lonLatParaMapa(0, 30);
        const [, y2] = lonLatParaMapa(0, -30);
        c.fillStyle = '#f2a93b';
        c.fillRect(1, y1 * sy, w - 2, (y2 - y1) * sy);
      }
      c.lineJoin = 'round';
      c.strokeStyle = '#6b5a3a';
      c.lineWidth = 1.2;
      c.fillStyle = '#e9dcb8';
      for (const p of [...terras, ANTARTIDA]) {
        poli(p);
        c.fill();
        c.stroke();
      }
      c.lineWidth = 2;
      rrect(c, 1, 1, w - 2, h - 2, 8);
      c.stroke();
    });
  mundo('mapa-oceanos', 'oceanos');
  mundo('mapa-oceano-sul', 'sul');
  mundo('mapa-mares-tropicais', 'tropicos');

  // Antártida vista de baixo (polo sul no meio), recortada em 50° S: aparece a pontinha da América do Sul
  tex(scene, 'mapa-antartica', 220, 220, (c) => {
    const k = 2.6;
    const proj = (lon: number, lat: number): [number, number] => {
      const r = (90 + lat) * k;
      const a = (lon * Math.PI) / 180;
      return [110 + r * Math.sin(a), 110 - r * Math.cos(a)];
    };
    const poli = (pts: Poly) => {
      c.beginPath();
      pts.forEach(([lon, lat], i) => {
        const [x, y] = proj(lon, lat);
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      });
      c.closePath();
    };
    c.save();
    c.beginPath();
    c.arc(110, 110, 40 * k, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#9fcbe6';
    c.fillRect(0, 0, 220, 220);
    c.lineJoin = 'round';
    c.strokeStyle = '#6b5a3a';
    c.lineWidth = 2;
    c.fillStyle = '#e9dcb8';
    poli(AMERICA_DO_SUL);
    c.fill();
    c.stroke();
    c.fillStyle = '#f2a93b';
    poli(ANTARTIDA);
    c.fill();
    c.stroke();
    c.restore();
    c.strokeStyle = '#6b5a3a';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(110, 110, 40 * k, 0, Math.PI * 2);
    c.stroke();
  });
}

export function gerarMapa(scene: Phaser.Scene) {
  mapinhas(scene);
  tex(scene, 'mapa-mundi', MAPA.largura, MAPA.altura, (c, w, h) => {
    const mar = c.createLinearGradient(0, 0, 0, h);
    mar.addColorStop(0, '#9fd0ec');
    mar.addColorStop(0.5, '#7fbfe3');
    mar.addColorStop(1, '#9fd0ec');
    c.fillStyle = mar;
    rrect(c, 0, 0, w, h, 26);
    c.fill();
    // ondinhas no mar
    c.strokeStyle = 'rgba(255,255,255,0.35)';
    c.lineWidth = 2;
    for (let y = 40; y < h; y += 70) {
      for (let x = (y / 70) % 2 ? 30 : 80; x < w; x += 140) {
        c.beginPath();
        c.arc(x, y, 10, Math.PI * 1.1, Math.PI * 1.9);
        c.stroke();
      }
    }
    const poligono = (pts: Poly) => {
      c.beginPath();
      pts.forEach(([lon, lat], i) => {
        const [x, y] = lonLatParaMapa(lon, lat);
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      });
      c.closePath();
    };
    c.lineJoin = 'round';
    c.strokeStyle = '#6b5a3a';
    c.lineWidth = 2.5;
    const terra = (pts: Poly, cor = '#e9dcb8') => {
      c.fillStyle = cor;
      poligono(pts);
      c.fill();
      c.stroke();
    };
    for (const p of [AMERICA_NORTE, AMERICA_DO_SUL, EURASIA, AFRICA, AUSTRALIA, TASMANIA, ARQUIPELAGO_CANADA, ISLANDIA, SVALBARD, ...ILHAS]) terra(p);
    terra(GROENLANDIA, '#f4f8fc');
    // Antártica: faixa branca no pé do mapa (o contorno da Antártida fica escondido por ela)
    const ant: Poly = [[-180, -70]];
    for (let lon = -170; lon <= 180; lon += 10) ant.push([lon, -68 - 3 * Math.sin(lon / 25)]);
    ant.push([180, -90], [-180, -90]);
    c.save();
    rrect(c, 0, 0, w, h, 26);
    c.clip();
    terra(ant, '#f4f8fc');
    c.restore();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    rrect(c, 2, 2, w - 4, h - 4, 24);
    c.stroke();
  });

  // Marcador de mundo que ainda vai chegar ("em breve")
  tex(scene, 'mundo-embreve', 130, 130, (c) => {
    c.fillStyle = '#d8d2c2';
    c.strokeStyle = '#8a8272';
    c.lineWidth = 5;
    c.beginPath();
    c.arc(65, 65, 44, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // ampulheta
    c.fillStyle = '#8a8272';
    c.beginPath();
    c.moveTo(47, 40);
    c.lineTo(83, 40);
    c.lineTo(65, 65);
    c.lineTo(83, 90);
    c.lineTo(47, 90);
    c.lineTo(65, 65);
    c.closePath();
    c.fill();
  });

  // Cadeado (fase ou mundo ainda fechado)
  tex(scene, 'cadeado', 48, 56, (c) => {
    c.strokeStyle = '#6b6258';
    c.lineWidth = 6;
    c.beginPath();
    c.arc(24, 22, 12, Math.PI, 0);
    c.stroke();
    c.fillStyle = '#9a9184';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 6, 22, 36, 30, 6);
    c.fill();
    c.stroke();
    c.fillStyle = OUTLINE;
    c.beginPath();
    c.arc(24, 35, 4, 0, Math.PI * 2);
    c.fill();
  });

  // Bolinha de fase (para escolher a fase dentro do mundo)
  const bolinha = (key: string, cor: string, borda: string) =>
    tex(scene, key, 104, 104, (c) => {
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.beginPath();
      c.arc(52, 56, 46, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = cor;
      c.strokeStyle = borda;
      c.lineWidth = 6;
      c.beginPath();
      c.arc(52, 50, 44, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    });
  bolinha('fase-feita', '#5cc26a', '#2f7d3f');
  bolinha('fase-aberta', '#f2c230', '#b88a14');
  bolinha('fase-fechada', '#cfc8b8', '#8a8272');

  // Visto (fase concluída)
  tex(scene, 'visto', 60, 50, (c) => {
    c.strokeStyle = '#fff';
    c.lineWidth = 10;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(8, 26);
    c.lineTo(24, 42);
    c.lineTo(52, 10);
    c.stroke();
  });

  // Botão do mapa (globo)
  tex(scene, 'btn-mapa', 84, 84, (c) => {
    c.fillStyle = '#5bb0e8';
    c.strokeStyle = '#1d2b3a';
    c.lineWidth = 5;
    c.beginPath();
    c.arc(42, 42, 38, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#9ee07a';
    c.beginPath();
    c.ellipse(32, 34, 12, 16, -0.4, 0, Math.PI * 2);
    c.ellipse(56, 52, 10, 13, 0.3, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.7)';
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(42, 42, 16, 36, 0, 0, Math.PI * 2);
    c.moveTo(6, 42);
    c.lineTo(78, 42);
    c.stroke();
  });
}
