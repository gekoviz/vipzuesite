/*
 * VIPZUE — Mesh drift overlay (adaptação isolada de ShaderBackground / 21st.dev)
 * Não substitui nenhum background existente. Não instala React/Tailwind.
 * API: adicione data-vz-mesh="dark" ou data-vz-mesh="light" ao root da seção.
 * O shader original fornecido é OPACO e VERDE: esta adaptação usa alpha
 * e a paleta aprovada, com limite de dois contextos WebGL ativos.
 * ESCOPO: camada exclusivamente decorativa, sem interação com GSAP/scroll.
 *
 * Código do prompt mestre V6.0 (08/11/2026). Cinco adaptações à página real, marcadas "VIPZUE (adaptação)":
 *  1. ponto de inserção da camada: depois do canvas opaco de js/light-field.js, onde a seção já tem um (§42/§44);
 *  2. área visível de cada root: o rodapé fixo é medido pela cortina que o recorta, e um root oculto (visibility:
 *     hidden, como o palco da Hero depois da troca) não disputa contexto (seleção por seção, §21);
 *  3. sem WebGL, nenhuma camada entra no DOM, para o fallback ser o fundo original pixel a pixel;
 *  4. (aprovada pelo usuário) contextos que migram entre as seções, criados e compilados uma vez só;
 *  5. (aprovada pelo usuário) a 1ª película espera a página ficar ociosa (no máximo 1 s).
 *
 * V6.1 "Fitas" (08/11/2026, pedido do usuário com as referências 22.jpg — Hero — e 23.jpg — Seção 03): na V6.0 a
 * película ficava abaixo do limiar da percepção (alfa 0,105/0,032 com teto 0,12 no shader). Agora:
 *  - o Mesh Drift continua (mesmos campos gaussianos e warp), com alfa visível;
 *  - FITAS de luz sobre ele: anéis elípticos em volta de um foco (escuro: os arcos Páprica em volta da águia da 22.jpg)
 *    ou ondas paralelas de cetim (claro: as dobras de seda da 23.jpg), que derivam devagar;
 *  - um halo opcional atrás do foco;
 *  - o canvas mede a TELA, não a seção: fica preso (sticky) dentro do root, como o campo de luz fixo da Hero e da 03.
 *    O desenho não desliza sob o palco fixo da 03 e o foco acompanha a águia. Seções altas não pagam pixels a mais.
 *  Foco, ângulo e força por seção vêm de variáveis CSS do root (css/vz-mesh-overlay.css), lidas só no resize.
 */
(() => {
  'use strict';
  const VERT = `attribute vec2 a_position;
    void main(){gl_Position=vec4(a_position,0.0,1.0);}`;

  // Preserva a técnica Mesh Drift: campos gaussianos de cores que derivam
  // lentamente + grão de filme; muda saída para alpha transparente.
  const FRAG = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec3 u_colors[8];
    uniform vec4 u_scene;     // resolução xy, tempo, número de cores
    uniform vec4 u_shape;     // escala, intensidade, ALPHA, warp
    uniform vec4 u_surface;   // detalhe, contraste, brilho, saturação
    uniform vec4 u_finish;    // hue (reservado), vignette, blur (reservado), grão
    uniform vec4 u_transform; // seed, rotação, drift, oklab (reservado)
    uniform vec4 u_space;     // deslocamento xy, reservado zw
    uniform vec4 u_cursor;    // reservado, desabilitado: sem rastreamento global
    // V6.1 — fitas (U = menor lado do quadro, em px do canvas)
    uniform vec4 u_rib;       // força, largura do halo (U), largura do núcleo (U), distância entre fitas (U)
    uniform vec4 u_rib2;      // ângulo (rad), ondulação (U), alcance (U), geometria (0 ondas, 1 anéis)
    uniform vec4 u_rib3;      // foco xy (fração do quadro, y para baixo), U (px), alfa máximo
    uniform vec4 u_rib4;      // achatamento do anel (ry/rx), raio do anel (U), modo (0 luz, 1 cetim), velocidade
    uniform vec4 u_glow;      // força, raio (U), reservado zw
    uniform vec3 u_ribA;      // halo da fita / sombra do cetim
    uniform vec3 u_ribB;      // núcleo da fita / brilho do cetim
    uniform vec4 u_quiet[12]; // zonas de silêncio: caixas dos textos (x0,y0,x1,y1 em px do canvas, y para baixo)
    uniform vec4 u_quietCfg;  // quantidade, difusão da borda (px), calma (0 a 1: fitas e halo recolhidos), reservado

    float hash21(vec2 p){
      #ifndef GL_FRAGMENT_PRECISION_HIGH
      p=mod(p,31.0);
      #endif
      p=fract(p*vec2(234.34,435.345));
      p+=dot(p,p+34.23);
      return fract(p.x*p.y);
    }
    float grainHash(vec2 p){
      vec3 p3=fract(vec3(p.xyx)*0.1031);
      p3+=dot(p3,p3.yzx+33.33);
      return fract((p3.x+p3.y)*p3.z);
    }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),u.x),
                 mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),u.x),u.y);
    }
    float fbm(vec2 p){
      float v=0.0,a=0.5;
      for(int i=0;i<5;i++){
        v+=a*noise(p);
        p=p*2.03+vec2(17.,9.2);
        a*=0.5;
      }
      return v;
    }
    vec3 shade(vec2 p,float t){
      vec3 acc=u_colors[0]*0.15;
      float total=0.15;
      for(int i=0;i<8;i++){
        if(float(i)>=u_scene.w) break;
        float fi=float(i);
        vec2 center=vec2(
          sin(t*(0.21+fi*0.071)+fi*2.4+u_transform.x),
          cos(t*(0.17+fi*0.093)+fi*1.7)
        )*(0.45+u_shape.y*0.35);
        float w=exp(-dot(p-center,p-center)*6.0);
        acc+=u_colors[i]*w;
        total+=w;
      }
      return acc/total;
    }
    // 1 dentro da caixa de um texto, caindo a 0 na distância de difusão (legibilidade acima da referência)
    float quiet(vec2 f){
      float q=0.0;
      for(int i=0;i<12;i++){
        if(float(i)>=u_quietCfg.x) break;
        vec4 r=u_quiet[i];
        vec2 d=abs(f-(r.xy+r.zw)*0.5)-(r.zw-r.xy)*0.5;
        float dist=length(max(d,0.0))+min(max(d.x,d.y),0.0);
        q=max(q,1.0-smoothstep(0.0,max(u_quietCfg.y,1.0),dist));
      }
      return q;
    }
    // composição alfa normal (alfa não pré-multiplicado): top sobre bot
    vec4 over(vec4 top,vec4 bot){
      float a=top.a+bot.a*(1.0-top.a);
      vec3 c=(top.rgb*top.a+bot.rgb*bot.a*(1.0-top.a))/max(a,0.0001);
      return vec4(c,a);
    }
    // V6.1 — fitas de seda/luz: curvas paralelas (ondas) ou concêntricas (anéis) em volta do foco, deformadas pelo mesmo
    // fbm do Mesh Drift, quebradas em trechos que viajam devagar ao longo da própria curva.
    vec4 ribbons(vec2 P,float t){
      float ca=cos(u_rib2.x), sa=sin(u_rib2.x);
      vec2 q=mat2(ca,sa,-sa,ca)*P;
      float across, phase;
      vec2 flow;
      if(u_rib2.w>0.5){
        vec2 e=vec2(q.x,q.y/max(u_rib4.x,0.05));
        float r=max(length(e),0.0001);
        across=r-u_rib4.y;
        phase=atan(e.y,e.x)*3.0;           // 3 ondulações por volta: contínuo no corte do atan
        flow=e/r*u_rib4.y;                 // ponto do anel de referência (contínuo em toda a volta)
      } else {
        across=q.y;
        phase=q.x*1.35;
        flow=vec2(q.x,0.0);
      }
      float tt=t*u_rib4.w;
      across+=(fbm(flow*0.45+vec2(tt*0.05,across*0.22-tt*0.03)+u_transform.x*0.0007)-0.5)*u_rib2.y*2.4;
      float gap=max(u_rib.w,0.02);
      float k0=floor(across/gap);
      vec3 cs=vec3(0.0);
      float aw=0.0, as=0.0;
      for(int j=0;j<2;j++){
        float k=k0+float(j);
        float d=across-k*gap-u_rib2.y*sin(phase+tt*0.42+k*2.17);
        float reach=max(u_rib2.z,0.0001);
        float env=exp(-(k*gap)*(k*gap)/(reach*reach));
        float seg=smoothstep(0.30,0.78,noise(flow*0.55+vec2(-tt*0.09,k*5.3+3.1)));
        float hw=u_rib.y, cw=max(u_rib.z,0.0005);
        vec3 c; float a;
        if(u_rib4.z<0.5){
          float halo=exp(-d*d/(hw*hw));
          float core=exp(-d*d/(cw*cw));
          a=(0.55*halo+0.95*core)*seg*env;
          c=mix(u_ribA,u_ribB,clamp(core*1.4,0.0,1.0));
        } else {
          // cetim: crista fina e clara, brilho curto antes dela e sombra pêssego que cai devagar depois
          float crest=exp(-d*d/(0.0324*hw*hw));
          float sheen=exp(-d*d/(0.36*hw*hw));
          float x=max(d,0.0)/hw;
          float shadow=step(0.0,d)*(1.0-exp(-x/0.3))*exp(-x/1.2);
          float aHi=clamp(0.9*crest+0.35*sheen,0.0,1.0);
          float aLo=1.1*shadow;
          a=(aHi+aLo*(1.0-aHi))*seg*env;
          c=mix(u_ribA,u_ribB,aHi/(aHi+aLo+0.0001));
        }
        a=clamp(a,0.0,1.0);
        cs+=c*a; aw+=a;
        as=1.0-(1.0-as)*(1.0-a);
      }
      vec3 col=aw>0.0001?cs/aw:u_ribB;
      return vec4(col,min(as*u_rib.x,u_rib3.w));
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/max(u_scene.xy,vec2(1.0));
      // Normalização por todo o quadro (V6.1: o quadro é a tela, não a seção inteira).
      vec2 p=(uv-0.5)*vec2(1.8,1.5)*u_shape.x;
      if(abs(u_transform.y)>0.0001){
        float ca=cos(u_transform.y), sa=sin(u_transform.y);
        p=mat2(ca,-sa,sa,ca)*p;
      }
      p+=u_space.xy;
      p+=u_transform.z*vec2(sin(u_scene.z*0.31),cos(u_scene.z*0.23));
      if(u_shape.w>0.0){
        p+=u_shape.w*(vec2(
          fbm(p*u_surface.x+u_transform.x),
          fbm(p*u_surface.x+vec2(5.2,1.3)))-0.5);
      }
      vec3 col=shade(p,u_scene.z);
      col=(col-0.5)*u_surface.y+0.5;
      float luma=dot(col,vec3(0.299,0.587,0.114));
      col=mix(vec3(luma),col,u_surface.w);
      col+=u_surface.z;
      if(u_finish.y>0.0001){
        float vd=length(uv-0.5)*1.41421356;
        col*=1.0-u_finish.y*smoothstep(0.35,1.0,vd);
      }
      col=clamp(col,0.0,1.0);
      float energy=dot(col,vec3(0.299,0.587,0.114));
      // V6.1: teto do alfa do Mesh Drift de 0,12 para 0,6 (nova autorização visual: referências 22.jpg e 23.jpg)
      float localAlpha=clamp(u_shape.z,0.0,0.6)
        * (0.45+0.55*smoothstep(0.12,0.70,energy));
      vec2 f=vec2(gl_FragCoord.x,u_scene.y-gl_FragCoord.y);
      float q=u_quietCfg.x>0.5?quiet(f):0.0;
      vec4 film=vec4(col,localAlpha*(1.0-0.8*q));
      // foco e fitas, em unidades U a partir do foco (y para baixo)
      vec2 P=(f-u_rib3.xy*u_scene.xy)/max(u_rib3.z,1.0);
      float calm=1.0-clamp(u_quietCfg.z,0.0,1.0);
      if(u_glow.x>0.0001){
        float g=exp(-dot(P,P)/max(u_glow.y*u_glow.y,0.0001))*u_glow.x*(1.0-0.7*q)*calm;
        film=over(vec4(mix(u_ribA,u_ribB,0.45),clamp(g,0.0,1.0)),film);
      }
      if(u_rib.x>0.0001&&calm>0.001){
        vec4 rb=ribbons(P,u_scene.z);
        rb.a*=(1.0-q)*calm;
        film=over(rb,film);
      }
      if(u_finish.w>0.0001){
        film.rgb+=(grainHash(gl_FragCoord.xy+u_transform.x)-0.5)*u_finish.w;
      }
      // REGRA CRÍTICA: alpha < 1. Nunca substituir o fundo de uma seção.
      gl_FragColor=vec4(clamp(film.rgb,0.0,1.0),min(film.a,0.95));
    }
  `;

  // V6.1: cada preset ganhou "rib" (fitas e halo). Cores só da paleta oficial ou derivadas dela:
  //   Páprica Profunda #B04C27, Páprica #D7673F, "Páprica acesa" #FF9A62 (Páprica levada à luz, só no núcleo fino das fitas);
  //   no claro, sombra Pêssego #EAB199 (Marfim #F3EDE3 com 45% de Páprica) e brilho Marfim aceso #FFF9F2.
  const P = {
    dark: {
      colors: ['#22201D', '#5B4632', '#9F3930', '#D7673F'],
      alpha: 0.2,
      scale: 1.16, intensity: 0.34, warp: 0.12,
      detail: 2.4, contrast: 1.12, brightness: 0,
      saturation: 1.0, vignette: 0, grain: 0.012,
      timeScale: 0.35, seed: 1453,
      rib: {
        geom: 1, mode: 0, strength: 1, halo: 0.075, core: 0.01, gap: 0.065, wave: 0.05, reach: 0.14,
        angle: -18, flat: 0.56, radius: 0.74, speed: 0.55, maxAlpha: 0.92,
        a: '#B04C27', b: '#FF9A62', glow: 0, glowR: 0.32
      }
    },
    light: {
      // Marfim, Pêssego claro #EBC5B2 (Marfim com 30% de Páprica) e Páprica: o rosado das dobras da 23.jpg
      colors: ['#F3EDE3', '#EBC5B2', '#D7673F', '#F3EDE3'],
      alpha: 0.22,
      scale: 1.16, intensity: 0.28, warp: 0.08,
      detail: 2.4, contrast: 1.04, brightness: 0,
      saturation: 0.9, vignette: 0, grain: 0.005,
      timeScale: 0.24, seed: 1453,
      rib: {
        geom: 0, mode: 1, strength: 1, halo: 0.12, core: 0.02, gap: 0.3, wave: 0.09, reach: 6,
        angle: -14, flat: 1, radius: 1, speed: 0.4, maxAlpha: 0.75,
        a: '#E3A283', b: '#FFFBF6', glow: 0, glowR: 0.3
      }
    }
  };
  // V6.1 — zonas de silêncio: caixas de todo texto do root (e do menu do topo) na tela; dentro delas as fitas somem e o
  // Mesh Drift cai a 20%, com borda difusa. Medidas no attach/resize, quando a rolagem muda e a cada 12 quadros.
  const QUIET = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,summary,blockquote,figcaption,label,button,a';
  const QUIET_EXTRA = '.site-header a';
  const QUIET_MAX = 12;
  const QUIET_PAD = 8; // CSS px em volta da caixa, já sem fita
  const QUIET_FEATHER = 64; // CSS px de difusão até a fita voltar inteira
  function mergeRects(list) {
    // une caixas que se tocam (linhas de um parágrafo, título + subtítulo colados)
    for (let changed = true; changed;) {
      changed = false;
      outer: for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        if (a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3]) {
          list[i] = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
          list.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
    // mais caixas que o shader recebe: junta o par que menos cresce
    const area = r => (r[2] - r[0]) * (r[3] - r[1]);
    while (list.length > QUIET_MAX) {
      let best = null;
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const u = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
        const cost = area(u) - area(a) - area(b);
        if (!best || cost < best.cost) best = {i, j, u, cost};
      }
      list[best.i] = best.u;
      list.splice(best.j, 1);
    }
    return list;
  }
  const maxLiveContexts = () =>
    window.matchMedia('(max-width: 767.98px)').matches ? 1 : 2;
  const roots = () => [...document.querySelectorAll('[data-vz-mesh]')];
  // VIPZUE (adaptação 4, aprovada pelo usuário em 08/11/2026): contextos que MIGRAM entre as seções. No original, sair de
  // uma seção destruía o contexto e entrar na seguinte criava outro, com nova compilação do shader (medido com o
  // navegador frio: travadas de até ~1 s na troca). Agora cada contexto é criado e compilado UMA vez e só muda de root:
  // a camada troca de lugar no DOM e os uniforms passam a ser os do preset da seção nova. Mesmo teto: 1 no celular, 2 acima.
  const pool = [];
  let unavailable = false; // sem WebGL ou shader com erro: fica o fundo original e não se tenta de novo nesta página
  let losses = 0; // contextos perdidos pelo navegador; depois de 3, a película desiste (fundo original)
  let ready = false; // adaptação 5: a 1ª película só nasce com a página ociosa
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = 0;

  function rgb(hex) {
    const s = hex.replace('#', '');
    return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16) / 255);
  }
  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('WebGL: shader indisponível');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Erro de compilação';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }
  function createProgram(gl) {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!program) throw new Error('WebGL: programa indisponível');
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || 'Erro de link';
      gl.deleteProgram(program);
      throw new Error(message);
    }
    return program;
  }

  class Renderer {
    constructor() {
      this.root = null;
      this.cfg = P.dark;
      this.layer = document.createElement('div');
      this.layer.className = 'vz-mesh-layer';
      this.layer.setAttribute('aria-hidden', 'true');
      // V6.1: quadro do tamanho da tela, preso (sticky) dentro da camada; o marcador mede o foco definido no CSS
      this.view = document.createElement('div');
      this.view.className = 'vz-mesh-view';
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'vz-mesh-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.probe = document.createElement('i');
      this.probe.className = 'vz-mesh-anchor';
      this.view.append(this.canvas, this.probe);
      this.layer.appendChild(this.view);
      this.gl = null;
      this.raf = 0;
      this.last = null;
      this.elapsed = 0;
      this.disposed = false;
      this.available = false;
      this.lost = false;
      try {
        const gl = this.canvas.getContext('webgl', {
          alpha: true,
          premultipliedAlpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'low-power'
        });
        // VIPZUE (adaptação 3): a camada só entra no DOM em attach(), com o WebGL pronto. Sem WebGL nada é inserido: uma
        // camada vazia já mudaria o antisserrilhado do texto da seção (medido: bordas das letras da FAQ, até 208 de soma RGB).
        if (!gl) { unavailable = true; this.dispose(); return; }
        this.gl = gl;
        this.program = createProgram(gl);
        gl.useProgram(this.program);
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(this.program, 'a_position');
        if (pos < 0) throw new Error('WebGL: a_position ausente');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        const loc = n => gl.getUniformLocation(this.program, n);
        this.u = {
          colors: loc('u_colors[0]'), scene: loc('u_scene'),
          shape: loc('u_shape'), surface: loc('u_surface'),
          finish: loc('u_finish'), transform: loc('u_transform'),
          space: loc('u_space'),
          rib: loc('u_rib'), rib2: loc('u_rib2'), rib3: loc('u_rib3'), rib4: loc('u_rib4'),
          glow: loc('u_glow'), ribA: loc('u_ribA'), ribB: loc('u_ribB'),
          quiet: loc('u_quiet[0]'), quietCfg: loc('u_quietCfg')
        };
        this.quietEls = [];
        this.quietBuf = new Float32Array(QUIET_MAX * 4);
        this.quietScroll = NaN;
        this.quietAge = 0;
        gl.clearColor(0, 0, 0, 0);
        this.onLost = event => {
          event.preventDefault();
          this.available = false;
          this.lost = true;
          losses++;
          cancelAnimationFrame(this.raf);
          this.raf = 0;
        };
        this.canvas.addEventListener('webglcontextlost', this.onLost);
        // V6.1: observa o próprio quadro (o tamanho dele segue a tela e a seção onde está)
        this.observer = new ResizeObserver(() => this.resize());
        this.observer.observe(this.view);
        this.available = true;
      } catch (error) {
        console.warn('[VIPZUE mesh] fallback original preservado:', error);
        unavailable = true;
        this.dispose();
      }
    }
    // Os uniforms do preset da seção (no original, fixados uma vez no construtor).
    preset(tone) {
      const c = this.cfg = P[tone] || P.dark;
      const gl = this.gl;
      gl.useProgram(this.program);
      const palette = c.colors.concat(Array(8 - c.colors.length).fill(c.colors[0]));
      gl.uniform3fv(this.u.colors, new Float32Array(palette.flatMap(rgb)));
      gl.uniform4f(this.u.shape, c.scale, c.intensity, c.alpha, c.warp);
      gl.uniform4f(this.u.surface, c.detail, c.contrast, c.brightness, c.saturation);
      gl.uniform4f(this.u.finish, 0, c.vignette, 0, c.grain);
      gl.uniform4f(this.u.transform, c.seed, 0, 0.025, 0);
      gl.uniform4f(this.u.space, 0, 0, 0, 0);
      gl.uniform3fv(this.u.ribA, new Float32Array(rgb(c.rib.a)));
      gl.uniform3fv(this.u.ribB, new Float32Array(rgb(c.rib.b)));
    }
    // V6.1: foco, unidade e ajustes da seção (variáveis CSS do root). Só no attach e no resize, nunca por quadro.
    layout(rect) {
      const gl = this.gl;
      const r = this.cfg.rib;
      const css = getComputedStyle(this.root);
      const v = (name, fallback) => {
        const n = parseFloat(css.getPropertyValue(name));
        return Number.isFinite(n) ? n : fallback;
      };
      const mark = this.probe.getBoundingClientRect();
      const ax = (mark.left - rect.left) / rect.width;
      const ay = (mark.top - rect.top) / rect.height;
      const unit = Math.min(rect.width, rect.height) * (this.canvas.width / rect.width);
      gl.useProgram(this.program);
      gl.uniform4f(this.u.rib, v('--vz-rib-strength', 1) * r.strength, r.halo, r.core, v('--vz-rib-gap', r.gap));
      gl.uniform4f(this.u.rib2, v('--vz-rib-angle', r.angle) * Math.PI / 180, v('--vz-rib-wave', r.wave),
        v('--vz-rib-reach', r.reach), v('--vz-rib-geom', r.geom));
      gl.uniform4f(this.u.rib3, ax, ay, unit, r.maxAlpha);
      gl.uniform4f(this.u.rib4, v('--vz-rib-flat', r.flat), v('--vz-rib-radius', r.radius), r.mode, r.speed);
      gl.uniform4f(this.u.glow, v('--vz-glow', r.glow), v('--vz-glow-r', r.glowR), 0, 0);
      this.quietEls = [...this.root.querySelectorAll(QUIET), ...document.querySelectorAll(QUIET_EXTRA)];
      // calma: um elemento da seção cuja opacidade recolhe as fitas (Hero: a sombra do close, data-vz-mesh-calm)
      const calm = this.root.getAttribute('data-vz-mesh-calm');
      this.calmEl = calm ? this.root.querySelector(calm) : null;
      this.measureQuiet(rect);
    }
    // V6.1: caixas dos textos no quadro, em px do canvas (y para baixo)
    measureQuiet(rect = this.view.getBoundingClientRect()) {
      this.quietScroll = window.scrollY;
      this.quietAge = 0;
      if (rect.width < 1 || rect.height < 1) return;
      const s = this.canvas.width / rect.width;
      const reach = QUIET_PAD + QUIET_FEATHER;
      const list = [];
      const range = this.range ||= document.createRange();
      for (const el of this.quietEls) {
        // texto invisível (frases da narrativa à espera, opacidade 0) não reserva espaço
        if (el.checkVisibility && !el.checkVisibility({opacityProperty: true, visibilityProperty: true})) continue;
        // a extensão do texto, não a da caixa: um h1 de bloco mede a largura do container inteiro
        range.selectNodeContents(el);
        let b = range.getBoundingClientRect();
        if (b.width < 2 || b.height < 2) b = el.getBoundingClientRect();
        if (b.width < 2 || b.height < 2) continue;
        const x0 = b.left - rect.left - QUIET_PAD, y0 = b.top - rect.top - QUIET_PAD;
        const x1 = b.right - rect.left + QUIET_PAD, y1 = b.bottom - rect.top + QUIET_PAD;
        if (x1 < -reach || y1 < -reach || x0 > rect.width + reach || y0 > rect.height + reach) continue;
        list.push([x0, y0, x1, y1]);
      }
      const boxes = mergeRects(list);
      this.quietBuf.fill(0);
      boxes.forEach((r, i) => this.quietBuf.set(r.map(n => n * s), i * 4));
      const gl = this.gl;
      gl.useProgram(this.program);
      gl.uniform4fv(this.u.quiet, this.quietBuf);
      // a sombra do close chega a 0,55: com 0,4 as fitas já sumiram
      const calm = this.calmEl ? Math.min(1, (parseFloat(getComputedStyle(this.calmEl).opacity) || 0) * 2.5) : 0;
      gl.uniform4f(this.u.quietCfg, boxes.length, QUIET_FEATHER * s, calm, 0);
    }
    attach(root) {
      if (!this.available || this.disposed) return;
      if (this.root !== root) {
        this.detach();
        this.root = root;
        this.preset(root.getAttribute('data-vz-mesh') === 'light' ? 'light' : 'dark');
        // VIPZUE (adaptação 1): onde a seção já tem o canvas opaco do campo de luz (js/light-field.js, também com
        // z-index -1), a camada entra logo depois dele, para ser pintada sobre esse fundo e não por baixo dele.
        // V6.1: na Hero, depois do .hero__bg (z-index -1 também), cujo halo de 50% cobria as fitas.
        // V7: no Método, depois do .vz-env (o ambiente escuro preso à tela, css/sections.css), pelo mesmo motivo.
        const under = root.querySelectorAll(':scope > .section-light-field, :scope > .hero__bg, :scope > .vz-env');
        const field = under[under.length - 1];
        root.insertBefore(this.layer, field ? field.nextSibling : root.firstChild);
        this.resize();
        // o 1º quadro na seção nova já é dela: nada do quadro da seção anterior aparece
        this.draw(reduced.matches ? 0 : this.elapsed);
      }
      this.resume();
    }
    detach() {
      this.pause();
      this.root = null;
      this.layer.remove();
    }
    resize() {
      if (!this.available || this.disposed || !this.root) return;
      const rect = this.view.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const mobile = window.matchMedia('(max-width: 767.98px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      const initialW = Math.max(1, Math.round(rect.width * dpr));
      const initialH = Math.max(1, Math.round(rect.height * dpr));
      const maxPixels = mobile ? 700000 : 1400000;
      const factor = Math.min(1, Math.sqrt(maxPixels / (initialW * initialH)));
      const w = Math.max(1, Math.round(initialW * factor));
      const h = Math.max(1, Math.round(initialH * factor));
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
      }
      this.layout(rect);
      if (reduced.matches || !this.raf) this.draw(reduced.matches ? 0 : this.elapsed);
    }
    draw(time) {
      if (!this.available || this.disposed || !this.gl) return;
      const gl = this.gl;
      gl.useProgram(this.program);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4f(this.u.scene, this.canvas.width, this.canvas.height,
        time * this.cfg.timeScale, this.cfg.colors.length);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    tick = now => {
      this.raf = 0;
      if (!this.available || this.disposed || !this.root || reduced.matches || document.hidden) return;
      const dt = this.last === null ? 0 : Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.elapsed += dt;
      if (window.scrollY !== this.quietScroll || ++this.quietAge >= 12) this.measureQuiet();
      this.draw(this.elapsed);
      this.raf = requestAnimationFrame(this.tick);
    };
    resume() {
      if (!this.available || this.disposed || !this.root) return;
      // movimento reduzido: quadro parado, redesenhado a cada rolagem (reconcile) com as caixas dos textos no lugar novo
      if (reduced.matches) { this.measureQuiet(); this.draw(0); return; }
      if (document.hidden || this.raf) return;
      this.last = null;
      this.raf = requestAnimationFrame(this.tick);
    }
    pause() {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.last = null;
    }
    dispose() {
      if (this.disposed) return;
      this.disposed = true;
      this.pause();
      this.observer?.disconnect();
      this.canvas?.removeEventListener('webglcontextlost', this.onLost);
      if (this.gl && !this.gl.isContextLost()) {
        if (this.buffer) this.gl.deleteBuffer(this.buffer);
        if (this.program) this.gl.deleteProgram(this.program);
        // Sem contextos acumulando.
        this.gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      this.root = null;
      this.layer?.remove();
    }
  }

  // VIPZUE (adaptação 2): a caixa que diz quanto do root está na tela. O rodapé em cortina é fixo na base da tela e
  // recortado pelo invólucro (.footer-curtain): mede-se o invólucro, como em js/light-field.js. Root oculto não conta.
  function visibleBox(root) {
    if (getComputedStyle(root).visibility === 'hidden') return null;
    return (root.closest('[data-footer-curtain]') || root).getBoundingClientRect();
  }

  function reconcile() {
    scheduled = 0;
    if (!ready || unavailable) return;
    const viewportH = window.innerHeight;
    const max = maxLiveContexts();
    const chosen = roots().map(root => {
      const rect = visibleBox(root);
      const visiblePixels = rect ? Math.max(0,
        Math.min(viewportH, rect.bottom) - Math.max(0, rect.top)) : 0;
      return {root, visiblePixels};
    }).filter(item => item.visiblePixels > 1)
      .sort((a, b) => b.visiblePixels - a.visiblePixels)
      .slice(0, max).map(x => x.root);
    // contexto perdido sai da lista (fica o fundo original); outro pode nascer, até 3 perdas na página
    for (let i = pool.length - 1; i >= 0; i--) {
      if (pool[i].lost || pool[i].disposed) { pool[i].dispose(); pool.splice(i, 1); }
    }
    // a tela passou para o celular (ex.: tablet girado): o contexto que sobra é desfeito
    while (pool.length > max) pool.pop().dispose();
    const free = pool.filter(renderer => !chosen.includes(renderer.root));
    if (document.hidden) {
      for (const renderer of free) renderer.detach();
      for (const renderer of pool) renderer.pause();
      return;
    }
    for (const root of chosen) {
      let renderer = pool.find(r => r.root === root) || free.shift();
      if (!renderer) {
        if (losses >= 3) break;
        renderer = new Renderer();
        if (!renderer.available) break;
        pool.push(renderer);
      }
      renderer.attach(root);
    }
    for (const renderer of free) renderer.detach();
  }
  function schedule() {
    if (!scheduled) scheduled = requestAnimationFrame(reconcile);
  }
  function onVisibilityChange() {
    if (document.hidden) for (const renderer of pool) renderer.pause();
    else schedule();
  }
  function onMotionChange() {
    for (const renderer of pool) {
      renderer.pause();
      renderer.resize();
      renderer.resume();
    }
  }
  function start() {
    if (!roots().length) return;
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule, {passive: true});
    window.addEventListener('orientationchange', schedule, {passive: true});
    window.addEventListener('pageshow', schedule);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reduced.addEventListener?.('change', onMotionChange);
    // VIPZUE (adaptação 5): a 1ª película (e a compilação do shader, a parte cara) espera a página ficar ociosa, no
    // máximo 1 s, para não disputar os primeiros quadros. Não espera o load: imagens e CDN lentos não a atrasam.
    // Sem requestIdleCallback (Safari), um intervalo curto.
    const go = () => { ready = true; schedule(); };
    if (window.requestIdleCallback) window.requestIdleCallback(go, {timeout: 1000});
    else setTimeout(go, 200);
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
