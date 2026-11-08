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
    void main(){
      vec2 uv=gl_FragCoord.xy/max(u_scene.xy,vec2(1.0));
      // Normalização por toda a seção, inclusive seções muito altas no mobile.
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
      if(u_finish.w>0.0001){
        col+=(grainHash(gl_FragCoord.xy+u_transform.x)-0.5)*u_finish.w;
      }
      col=clamp(col,0.0,1.0);
      float energy=dot(col,vec3(0.299,0.587,0.114));
      float localAlpha=clamp(u_shape.z,0.0,0.12)
        * (0.45+0.55*smoothstep(0.12,0.70,energy));
      // REGRA CRÍTICA: alpha < 1. Nunca substituir o fundo de uma seção.
      gl_FragColor=vec4(col,localAlpha);
    }
  `;

  const P = {
    dark: {
      colors: ['#22201D', '#5B4632', '#9F3930', '#D7673F'],
      alpha: 0.105,
      scale: 1.16, intensity: 0.34, warp: 0.035,
      detail: 2.4, contrast: 1.12, brightness: 0,
      saturation: 1.0, vignette: 0, grain: 0.012,
      timeScale: 0.35, seed: 1453
    },
    light: {
      // APENAS cores da paleta oficial; a luz é deliberadamente MUITO sutil.
      colors: ['#F3EDE3', '#F3EDE3', '#D7673F', '#9F3930'],
      alpha: 0.032,
      scale: 1.16, intensity: 0.28, warp: 0.020,
      detail: 2.4, contrast: 1.04, brightness: 0,
      saturation: 0.83, vignette: 0, grain: 0.005,
      timeScale: 0.24, seed: 1453
    }
  };
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
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'vz-mesh-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.layer.appendChild(this.canvas);
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
          space: loc('u_space')
        };
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
        this.observer = new ResizeObserver(() => this.resize());
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
    }
    attach(root) {
      if (!this.available || this.disposed) return;
      if (this.root !== root) {
        this.detach();
        this.root = root;
        this.preset(root.getAttribute('data-vz-mesh') === 'light' ? 'light' : 'dark');
        // VIPZUE (adaptação 1): onde a seção já tem o canvas opaco do campo de luz (js/light-field.js, também com
        // z-index -1), a camada entra logo depois dele, para ser pintada sobre esse fundo e não por baixo dele.
        const field = root.querySelector(':scope > .section-light-field');
        root.insertBefore(this.layer, field ? field.nextSibling : root.firstChild);
        this.observer.observe(root);
        this.resize();
        // o 1º quadro na seção nova já é dela: nada do quadro da seção anterior aparece
        this.draw(reduced.matches ? 0 : this.elapsed);
      }
      this.resume();
    }
    detach() {
      this.pause();
      if (this.root) this.observer?.unobserve(this.root);
      this.root = null;
      this.layer.remove();
    }
    resize() {
      if (!this.available || this.disposed || !this.root) return;
      const rect = this.layer.getBoundingClientRect();
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
      if (reduced.matches) this.draw(0);
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
      this.draw(this.elapsed);
      this.raf = requestAnimationFrame(this.tick);
    };
    resume() {
      if (!this.available || this.disposed || !this.root) return;
      if (reduced.matches) { this.draw(0); return; }
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
