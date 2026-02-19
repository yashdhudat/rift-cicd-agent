import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   STYLES — injected as a <style> tag
   ═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}

:root{
  --ink:#04020a; --ink1:#080510; --ink2:#0e0916; --ink3:#150d1e; --ink4:#1d1228;
  --maroon:#7a0e22; --maroon2:#9b1530; --maroon3:#3d0711; --maroon-g:rgba(122,14,34,0.4);
  --red:#e8192c; --red2:#ff2d42; --red3:#ff6575; --red-soft:#ff8f9a;
  --red-g:rgba(232,25,44,0.15); --red-glow:rgba(232,25,44,0.3);
  --glass:rgba(14,9,22,0.55); --glass2:rgba(20,13,32,0.7);
  --border:rgba(232,25,44,0.12); --border2:rgba(232,25,44,0.28); --border3:rgba(255,255,255,0.06);
  --text:#f5eef0; --text2:#c8b8bc; --muted:#7a6068; --muted2:#a08890;
  --green:#00ffa3; --green-g:rgba(0,255,163,0.1); --amber:#ffb830; --blue:#5b9cf6;
  --font:'Outfit',sans-serif; --mono:'JetBrains Mono',monospace;
}

body{background:var(--ink);color:var(--text);font-family:var(--font);min-height:100vh;overflow-x:hidden;}

#bgCanvas{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;}

.app{position:relative;z-index:2;min-height:100vh;display:flex;flex-direction:column;}

/* NAVBAR */
.rift-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;
  padding:0 52px;height:68px;background:rgba(4,2,10,0.75);
  backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--border);}
.nav-logo{display:flex;align-items:center;gap:14px;}
.logo-gem{width:38px;height:38px;border-radius:8px;
  background:linear-gradient(135deg,var(--maroon) 0%,var(--red) 60%,#ff6575 100%);
  display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;
  box-shadow:0 0 20px var(--red-glow),0 0 40px rgba(232,25,44,0.15);flex-shrink:0;letter-spacing:-0.03em;}
.logo-text{display:flex;flex-direction:column;gap:2px;}
.logo-title{font-size:14px;font-weight:800;letter-spacing:0.04em;color:var(--text);}
.logo-sub{font-family:var(--mono);font-size:9px;color:var(--muted2);letter-spacing:0.18em;text-transform:uppercase;}
.nav-ticker{display:flex;align-items:center;gap:8px;overflow:hidden;
  font-family:var(--mono);font-size:10px;color:var(--muted);letter-spacing:0.12em;}
.ticker-dot{width:4px;height:4px;border-radius:50%;background:var(--red);animation:blink 1.5s infinite;}
.nav-pill{display:flex;align-items:center;gap:7px;padding:7px 16px;border-radius:100px;
  background:rgba(0,255,163,0.06);border:1px solid rgba(0,255,163,0.2);
  font-family:var(--mono);font-size:10px;font-weight:500;color:var(--green);letter-spacing:0.1em;}
.pulse{width:7px;height:7px;border-radius:50%;background:var(--green);
  animation:pulse-ring 2s infinite;box-shadow:0 0 0 0 rgba(0,255,163,0.4);}

/* HERO */
.hero{position:relative;overflow:hidden;padding:80px 52px 64px;border-bottom:1px solid var(--border);}
.hero-glow{position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:900px;height:500px;
  background:radial-gradient(ellipse,rgba(122,14,34,0.25) 0%,rgba(232,25,44,0.08) 40%,transparent 70%);pointer-events:none;}
.hero-inner{position:relative;max-width:1000px;}
.hero-kicker{display:inline-flex;align-items:center;gap:10px;padding:6px 16px;border-radius:100px;
  background:rgba(232,25,44,0.08);border:1px solid rgba(232,25,44,0.25);margin-bottom:28px;}
.kicker-line{width:20px;height:1.5px;background:var(--red);border-radius:2px;}
.kicker-text{font-family:var(--mono);font-size:10px;color:var(--red3);letter-spacing:0.2em;text-transform:uppercase;font-weight:500;}
.hero-h1{font-size:clamp(42px,7vw,88px);font-weight:900;line-height:0.95;letter-spacing:-0.04em;margin-bottom:24px;}
.hero-h1 .line1{display:block;color:var(--text);}
.hero-h1 .line2{display:block;background:linear-gradient(90deg,var(--red) 0%,var(--red3) 50%,#ffb0b8 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero-h1 .line3{display:block;color:var(--text);opacity:0.5;}
.hero-desc{font-size:16px;font-weight:400;color:var(--text2);line-height:1.7;max-width:520px;margin-bottom:36px;}
.hero-desc strong{color:var(--red3);font-weight:600;}
.hero-tags{display:flex;flex-wrap:wrap;gap:10px;}
.htag{font-family:var(--mono);font-size:11px;padding:7px 16px;border-radius:6px;transition:all 0.25s;cursor:default;}
.htag.hot{background:rgba(232,25,44,0.1);border:1px solid rgba(232,25,44,0.3);color:var(--red3);}
.htag.hot:hover{background:rgba(232,25,44,0.18);border-color:var(--red);transform:translateY(-2px);}
.htag.cool{background:rgba(255,255,255,0.03);border:1px solid var(--border3);color:var(--muted2);}
.htag.cool:hover{border-color:rgba(255,255,255,0.12);color:var(--text2);transform:translateY(-2px);}
.hero-nodes{position:absolute;right:0;top:0;bottom:0;width:420px;pointer-events:none;opacity:0.6;}

/* MAIN */
.rift-main{flex:1;max-width:1380px;width:100%;margin:0 auto;padding:52px 52px 100px;display:flex;flex-direction:column;gap:48px;}

/* SECTION CHROME */
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.sl{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:10px;font-weight:500;
  color:var(--muted2);letter-spacing:0.2em;text-transform:uppercase;}
.sl::before{content:'';width:24px;height:1.5px;background:linear-gradient(90deg,var(--red),transparent);border-radius:2px;}
.sn{background:var(--red-g);color:var(--red);border:1px solid rgba(232,25,44,0.25);
  padding:2px 8px;border-radius:3px;font-size:9px;letter-spacing:0.1em;}

/* GLASS CARD */
.gc{background:var(--glass);backdrop-filter:blur(20px) saturate(150%);border:1px solid var(--border);
  border-radius:16px;transition:border-color 0.3s,box-shadow 0.3s;}
.gc:hover{border-color:rgba(232,25,44,0.22);
  box-shadow:0 0 40px rgba(122,14,34,0.15),0 0 1px rgba(232,25,44,0.3) inset;}

/* INPUT */
.input-wrap{padding:40px;}
.input-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:20px;}
.fld{display:flex;flex-direction:column;gap:10px;}
.flabel{font-family:var(--mono);font-size:10px;font-weight:500;color:var(--muted2);letter-spacing:0.16em;
  text-transform:uppercase;display:flex;align-items:center;gap:6px;}
.flabel-dot{width:5px;height:5px;border-radius:50%;background:var(--red);opacity:0.7;}
.finput{background:rgba(4,2,10,0.6);border:1px solid rgba(255,255,255,0.08);border-radius:10px;
  padding:14px 18px;font-family:var(--font);font-size:14px;color:var(--text);outline:none;
  transition:all 0.25s;width:100%;}
.finput::placeholder{color:var(--muted);}
.finput:focus{border-color:var(--red);background:rgba(232,25,44,0.04);
  box-shadow:0 0 0 3px rgba(232,25,44,0.08),0 0 30px rgba(232,25,44,0.06);}
.finput:disabled{opacity:0.35;cursor:not-allowed;}
.branch-bar{margin-top:20px;padding:14px 20px;background:rgba(232,25,44,0.05);
  border:1px solid rgba(232,25,44,0.2);border-left:3px solid var(--red);border-radius:10px;
  font-family:var(--mono);font-size:12px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  animation:fadeSlide 0.3s ease;}
.bb-label{color:var(--muted2);}
.bb-val{color:var(--red3);font-weight:500;}
.err-bar{margin-top:16px;padding:13px 18px;background:rgba(232,25,44,0.07);
  border:1px solid rgba(232,25,44,0.3);border-radius:10px;font-family:var(--mono);
  font-size:11px;color:var(--red3);display:flex;align-items:center;gap:8px;animation:shake 0.35s ease;}
.input-actions{display:flex;justify-content:space-between;align-items:center;margin-top:28px;flex-wrap:wrap;gap:14px;}
.action-hint{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:0.05em;}
.btn-run{position:relative;overflow:hidden;display:flex;align-items:center;gap:10px;
  padding:15px 40px;border:none;border-radius:12px;
  background:linear-gradient(135deg,var(--maroon2) 0%,var(--red) 50%,#ff4d5e 100%);
  color:#fff;font-family:var(--font);font-size:15px;font-weight:700;letter-spacing:0.03em;
  cursor:pointer;transition:all 0.3s;
  box-shadow:0 4px 24px var(--red-glow),0 1px 0 rgba(255,255,255,0.1) inset;}
.btn-run:hover{transform:translateY(-2px);box-shadow:0 8px 40px var(--red-glow),0 0 80px rgba(232,25,44,0.12);}
.btn-run:active{transform:translateY(0);}
.btn-run:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-run.busy{background:var(--ink3);color:var(--red3);border:1px solid var(--border2);box-shadow:none;}
.btn-new{padding:15px 24px;border:1px solid var(--border2);border-radius:12px;
  background:rgba(255,255,255,0.02);color:var(--muted2);font-family:var(--font);
  font-size:14px;font-weight:600;cursor:pointer;transition:all 0.25s;}
.btn-new:hover{border-color:rgba(255,255,255,0.15);color:var(--text);background:rgba(255,255,255,0.04);}
.spin{width:15px;height:15px;border:2px solid rgba(232,25,44,0.3);border-top-color:var(--red);
  border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block;}

/* SUMMARY */
.summary-grid{display:grid;grid-template-columns:repeat(6,1fr);}
.sc{padding:28px 22px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);transition:background 0.2s;}
.sc:last-child{border-right:none;}
.sc:hover{background:rgba(232,25,44,0.04);}
.sc-l{font-family:var(--mono);font-size:9px;font-weight:600;color:var(--muted);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:12px;}
.sc-v{font-size:15px;font-weight:700;color:var(--text);line-height:1.3;word-break:break-all;}
.sc-v.mono{font-family:var(--mono);font-size:11px;color:var(--red3);}
.sc-v.giant{font-family:var(--mono);font-size:48px;font-weight:700;line-height:1;}
.sc-v.neg{color:var(--red);}
.sc-v.pos{color:var(--green);}
.sc-v.tval{font-family:var(--mono);font-size:24px;font-weight:600;}
.sc-sub{font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px;}
.gchip{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:8px;
  font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:0.08em;}
.gchip.pass{background:var(--green-g);color:var(--green);border:1px solid rgba(0,255,163,0.25);}
.gchip.fail{background:var(--red-g);color:var(--red2);border:1px solid rgba(232,25,44,0.3);}
.gchip.run{background:rgba(122,14,34,0.2);color:var(--red3);border:1px solid var(--border2);}
.gchip.wait{background:rgba(255,184,48,0.08);color:var(--amber);border:1px solid rgba(255,184,48,0.2);}

/* DUAL LAYOUT */
.dual{display:grid;grid-template-columns:1fr 1fr;gap:24px;}

/* SCORE */
.score-inner{padding:36px;}
.score-top{display:flex;align-items:center;gap:32px;margin-bottom:32px;}
.donut{position:relative;width:130px;height:130px;flex-shrink:0;}
.donut-svg{width:130px;height:130px;transform:rotate(-90deg);}
.donut-bg{fill:none;stroke:var(--ink3);stroke-width:10;}
.donut-fg{fill:none;stroke-width:10;stroke-linecap:round;stroke-dasharray:326;stroke-dashoffset:326;
  stroke:var(--red);transition:stroke-dashoffset 2s cubic-bezier(0.25,1,0.5,1),stroke 0.5s;}
.donut-val{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.dv-num{font-family:var(--mono);font-size:32px;font-weight:600;line-height:1;color:var(--red);}
.dv-cap{font-family:var(--mono);font-size:9px;color:var(--muted);margin-top:3px;}
.score-breakdown{flex:1;display:flex;flex-direction:column;gap:18px;}
.sr{display:grid;grid-template-columns:1fr 120px 52px;gap:12px;align-items:center;}
.sr-name{font-size:13px;color:var(--text2);font-weight:500;}
.sr-name em{display:block;font-family:var(--mono);font-size:9px;color:var(--muted);font-style:normal;margin-top:2px;}
.sr-bar{background:var(--ink3);border-radius:100px;height:5px;overflow:hidden;}
.sr-fill{height:100%;border-radius:100px;transition:width 1.8s cubic-bezier(0.25,1,0.5,1);}
.sr-pts{font-family:var(--mono);font-size:13px;font-weight:600;text-align:right;}
.sr-pts.p{color:var(--green);}
.sr-pts.n{color:var(--red);}
.sr-pts.t{color:var(--red3);}
.sr-div{height:1px;background:var(--border);}

/* TIMELINE */
.tl-inner{padding:36px;}
.ib{font-family:var(--mono);font-size:10px;color:var(--muted2);padding:4px 12px;
  border:1px solid var(--border3);border-radius:100px;background:var(--ink2);}
.tl-empty{display:flex;flex-direction:column;align-items:center;gap:12px;padding:50px 20px;
  font-family:var(--mono);font-size:11px;color:var(--muted);}
.tl-empty-ico{font-size:36px;opacity:0.4;}
.tl-list{display:flex;flex-direction:column;}
.tl-row{display:flex;gap:16px;}
.tl-spine{display:flex;flex-direction:column;align-items:center;width:38px;flex-shrink:0;}
.tl-dot{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:12px;font-weight:700;border:2px solid;flex-shrink:0;}
.tl-dot.ok{background:var(--green-g);color:var(--green);border-color:var(--green);box-shadow:0 0 16px rgba(0,255,163,0.25);}
.tl-dot.bad{background:var(--red-g);color:var(--red2);border-color:var(--red);}
.tl-dot.dim{background:var(--ink3);color:var(--muted);border-color:var(--border3);font-size:20px;}
.tl-line{flex:1;width:1px;min-height:22px;background:var(--border);margin:5px 0;}
.tl-line.ok{background:linear-gradient(to bottom,var(--green),rgba(0,255,163,0.05));}
.tl-line.bad{background:linear-gradient(to bottom,var(--red),rgba(232,25,44,0.05));}
.tl-body{padding:5px 0 26px;flex:1;}
.tl-head{display:flex;align-items:center;gap:10px;margin-bottom:7px;}
.tl-chip{font-family:var(--mono);font-size:10px;font-weight:700;padding:3px 10px;border-radius:5px;letter-spacing:0.06em;}
.tl-chip.ok{background:var(--green-g);color:var(--green);}
.tl-chip.bad{background:var(--red-g);color:var(--red2);}
.tl-run{font-family:var(--mono);font-size:11px;color:var(--muted2);}
.tl-meta{font-family:var(--mono);font-size:10px;color:var(--muted);display:flex;gap:14px;flex-wrap:wrap;}
.tl-rem{color:var(--amber)!important;}
.tl-ghost{font-family:var(--mono);font-size:10px;color:var(--muted);padding:4px 0 26px;}

/* FIXES TABLE */
.tscroll{overflow-x:auto;border-radius:16px;border:1px solid var(--border);}
table{width:100%;border-collapse:collapse;}
thead tr{background:rgba(14,9,22,0.8);}
th{padding:13px 20px;font-family:var(--mono);font-size:9px;font-weight:600;color:var(--muted);
  letter-spacing:0.18em;text-align:left;text-transform:uppercase;white-space:nowrap;border-bottom:1px solid var(--border);}
td{padding:15px 20px;border-bottom:1px solid rgba(232,25,44,0.06);font-size:13px;}
tr:last-child td{border-bottom:none;}
tbody tr{transition:background 0.2s;}
tbody tr:hover{background:rgba(232,25,44,0.04);}
tbody tr.rp{border-left:2px solid rgba(0,255,163,0.5);}
tbody tr.rf{border-left:2px solid rgba(232,25,44,0.5);}
.fcode{font-family:var(--mono);font-size:11px;color:var(--blue);}
.bchip{font-family:var(--mono);font-size:9px;font-weight:700;padding:4px 11px;border-radius:5px;border:1px solid;letter-spacing:0.06em;white-space:nowrap;}
.b-LINTING{background:rgba(0,255,163,0.07);color:#3fffb8;border-color:rgba(0,255,163,0.2);}
.b-SYNTAX{background:rgba(232,25,44,0.07);color:#ff7585;border-color:rgba(232,25,44,0.25);}
.b-LOGIC{background:rgba(91,156,246,0.07);color:#8ab5ff;border-color:rgba(91,156,246,0.2);}
.b-TYPE_ERROR{background:rgba(255,184,48,0.07);color:#ffc966;border-color:rgba(255,184,48,0.2);}
.b-IMPORT{background:rgba(168,85,247,0.07);color:#c49dff;border-color:rgba(168,85,247,0.2);}
.b-INDENTATION{background:rgba(251,191,36,0.07);color:#fcd566;border-color:rgba(251,191,36,0.2);}
.lnum{font-family:var(--mono);font-size:12px;color:var(--muted2);}
.cmsg{font-family:var(--mono);font-size:10px;color:var(--muted);}
.fstat{font-family:var(--mono);font-size:10px;font-weight:700;padding:4px 11px;border-radius:5px;display:inline-flex;align-items:center;gap:5px;}
.fstat.ok{background:var(--green-g);color:var(--green);}
.fstat.bad{background:var(--red-g);color:var(--red2);}

/* TERMINAL */
.term{border-radius:16px;overflow:hidden;border:1px solid var(--border);}
.term-bar{display:flex;align-items:center;gap:14px;padding:12px 20px;
  background:rgba(14,9,22,0.9);border-bottom:1px solid var(--border);}
.tcc{display:flex;gap:7px;}
.td-dot{width:12px;height:12px;border-radius:50%;}
.term-title{font-family:var(--mono);font-size:10px;color:var(--muted);flex:1;text-align:center;}
.live-badge{font-family:var(--mono);font-size:9px;font-weight:700;color:var(--red3);
  border:1px solid rgba(232,25,44,0.3);padding:3px 10px;border-radius:100px;
  display:flex;align-items:center;gap:5px;letter-spacing:0.1em;}
.term-body{background:#060310;padding:22px 26px;max-height:320px;overflow-y:auto;
  font-family:var(--mono);font-size:12px;line-height:2;}
.ll{display:flex;gap:14px;}
.lp{color:var(--red);flex-shrink:0;}
.lt{color:#d0c8d4;}
.lc{color:var(--red);animation:blink 1s step-end infinite;}

/* FOOTER */
.rift-footer{border-top:1px solid var(--border);padding:22px 52px;background:rgba(4,2,10,0.8);
  backdrop-filter:blur(20px);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;}
.foot-l{font-family:var(--mono);font-size:10px;color:var(--muted);display:flex;gap:22px;flex-wrap:wrap;}
.foot-badge{font-size:11px;font-weight:700;letter-spacing:0.06em;
  background:linear-gradient(90deg,var(--red),var(--red3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:var(--ink1);}
::-webkit-scrollbar-thumb{background:var(--maroon3);border-radius:100px;}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{50%{opacity:0}}
@keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(0,255,163,0.5)}70%{box-shadow:0 0 0 8px rgba(0,255,163,0)}100%{box-shadow:0 0 0 0 rgba(0,255,163,0)}}
@keyframes fadeSlide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
@keyframes floatUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

@media(max-width:1100px){.summary-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:900px){.input-grid{grid-template-columns:1fr}.dual{grid-template-columns:1fr}.rift-nav{padding:0 24px}.hero{padding:52px 24px 44px}.rift-main{padding:36px 24px 80px}.rift-footer{padding:20px 24px}}
@media(max-width:600px){.summary-grid{grid-template-columns:1fr 1fr}.nav-ticker{display:none}}
`;

/* ═══════════════════════════════════════════════
   CANVAS BACKGROUND
   ═══════════════════════════════════════════════ */
function useParticleCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, frame = 0, animId;
    const COLORS = ["rgba(232,25,44,","rgba(122,14,34,","rgba(255,101,117,","rgba(155,21,48,"];

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = Math.random() * W; this.y = init ? Math.random() * H : H + 10;
        this.size = Math.random() * 1.8 + 0.3; this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.15; this.opacity = Math.random() * 0.5 + 0.1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.life = 0; this.maxLife = Math.random() * 300 + 200;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY; this.life++;
        const r = this.life / this.maxLife;
        this.currentOpacity = r < 0.1 ? this.opacity * (r / 0.1) : r > 0.8 ? this.opacity * (1 - (r - 0.8) / 0.2) : this.opacity;
        if (this.life > this.maxLife) this.reset(false);
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.currentOpacity + ")"; ctx.fill();
      }
    }

    class FlowLine {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.len = Math.random() * 80 + 30; this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.3 + 0.05; this.opacity = Math.random() * 0.06 + 0.01;
        this.width = Math.random() * 0.5 + 0.2; this.life = 0; this.maxLife = Math.random() * 200 + 100;
      }
      update() {
        this.angle += 0.003; this.x += Math.cos(this.angle) * this.speed; this.y += Math.sin(this.angle) * this.speed;
        this.life++;
        if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        const ex = this.x + Math.cos(this.angle) * this.len; const ey = this.y + Math.sin(this.angle) * this.len;
        const g = ctx.createLinearGradient(this.x, this.y, ex, ey);
        g.addColorStop(0, "rgba(232,25,44,0)"); g.addColorStop(0.5, `rgba(232,25,44,${this.opacity})`); g.addColorStop(1, "rgba(122,14,34,0)");
        ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = g; ctx.lineWidth = this.width; ctx.stroke();
      }
    }

    const orbs = [
      { x: 0.7, y: 0.1, r: 0.4, c: "rgba(122,14,34,", base: 0.18, phase: 0 },
      { x: 0.1, y: 0.7, r: 0.35, c: "rgba(232,25,44,", base: 0.07, phase: 1.5 },
      { x: 0.5, y: 0.5, r: 0.55, c: "rgba(77,9,21,", base: 0.12, phase: 3 },
    ];

    function drawOrbs() {
      orbs.forEach(o => {
        const pulse = Math.sin(frame * 0.004 + o.phase) * 0.03;
        const gx = (o.x + Math.sin(frame * 0.003 + o.phase) * 0.05) * W;
        const gy = (o.y + Math.cos(frame * 0.002 + o.phase) * 0.04) * H;
        const gr = Math.max(W, H) * (o.r + pulse);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, o.c + (o.base + pulse) + ")"); g.addColorStop(1, o.c + "0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
    }

    function drawGrid() {
      const spacing = 38, cols = Math.ceil(W / spacing), rows = Math.ceil(H / spacing);
      for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) {
        const wave = Math.sin(frame * 0.008 + i * 0.3 + j * 0.2) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(i * spacing, j * spacing, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,25,44,${0.03 + wave * 0.04})`; ctx.fill();
      }
    }

    let scanY = -200, scanning = false;
    function triggerScan() { scanY = -200; scanning = true; setTimeout(triggerScan, 6000 + Math.random() * 4000); }
    const scanTimer = setTimeout(triggerScan, 3000);

    function drawScan() {
      if (!scanning) return; scanY += 3;
      const g = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      g.addColorStop(0, "rgba(232,25,44,0)"); g.addColorStop(0.5, "rgba(232,25,44,0.025)"); g.addColorStop(1, "rgba(232,25,44,0)");
      ctx.fillStyle = g; ctx.fillRect(0, scanY - 60, W, 120);
      if (scanY > H + 200) scanning = false;
    }

    resize();
    const particles = Array.from({ length: 120 }, () => new Particle());
    const lines = Array.from({ length: 25 }, () => new FlowLine());
    window.addEventListener("resize", resize);

    function loop() {
      ctx.clearRect(0, 0, W, H); drawOrbs(); drawGrid();
      lines.forEach(l => { l.update(); l.draw(); });
      particles.forEach(p => { p.update(); p.draw(); });
      drawScan(); frame++;
      animId = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(animId); clearTimeout(scanTimer); window.removeEventListener("resize", resize); };
  }, [canvasRef]);
}

/* ═══════════════════════════════════════════════
   DEMO DATA
   ═══════════════════════════════════════════════ */
const DEMO_STEPS = [
  { d: 400,  m: "🔍 RepoAnalyzer: Cloning repository..." },
  { d: 1000, m: "✅ Repository cloned to /tmp/agent_repo_x9f2" },
  { d: 1500, m: "🌿 Branch created" },
  { d: 2000, m: "🧪 TestRunner: Discovering test files..." },
  { d: 2500, m: "📁 Found 4 files: utils.py · validator.py · calculator.py · auth.py" },
  { d: 3000, m: "🧪 Running pytest --tb=short -q --no-header..." },
  { d: 3800, m: "❌ src/utils.py:15 — F401 'os' imported but unused  [LINTING]" },
  { d: 4100, m: "❌ src/validator.py:8 — SyntaxError: expected ':' after if  [SYNTAX]" },
  { d: 4400, m: "❌ src/calculator.py:23 — AssertionError: expected 10, got 9  [LOGIC]" },
  { d: 4700, m: "❌ src/auth.py:41 — TypeError: unsupported operand str + int  [TYPE_ERROR]" },
  { d: 5400, m: "🤖 BugFixer: Sending 4 issues to Claude Sonnet API..." },
  { d: 6200, m: "✏️  Analyzing + fixing LINTING in src/utils.py..." },
  { d: 7000, m: "✅ [AI-AGENT] Fix LINTING in src/utils.py — committed (abc1234)" },
  { d: 7600, m: "✏️  Analyzing + fixing SYNTAX in src/validator.py..." },
  { d: 8400, m: "✅ [AI-AGENT] Fix SYNTAX in src/validator.py — committed (def5678)" },
  { d: 9000, m: "✏️  Analyzing + fixing LOGIC in src/calculator.py..." },
  { d: 9800, m: "✅ [AI-AGENT] Fix LOGIC in src/calculator.py — committed (ghi9012)" },
  { d: 10400, m: "✏️  Analyzing + fixing TYPE_ERROR in src/auth.py..." },
  { d: 11200, m: "✅ [AI-AGENT] Fix TYPE_ERROR in src/auth.py — committed (jkl3456)" },
  { d: 11800, m: "🚀 Pushing 4 commits to remote branch..." },
  { d: 12600, m: "🚦 CIMonitor: Re-running full test suite..." },
  { d: 13400, m: "✅ pytest: 18 passed, 0 failed — 0 errors" },
  { d: 13800, m: "✅ flake8: no style violations found" },
  { d: 14400, m: "🎉 All CI checks passing — mission accomplished!" },
];

const DEMO_FIXES = [
  { file: "src/utils.py",     bug_type: "LINTING",    line: 15, commit_message: "[AI-AGENT] Fix LINTING in src/utils.py",     status: "FIXED" },
  { file: "src/validator.py", bug_type: "SYNTAX",     line: 8,  commit_message: "[AI-AGENT] Fix SYNTAX in src/validator.py",  status: "FIXED" },
  { file: "src/calculator.py",bug_type: "LOGIC",      line: 23, commit_message: "[AI-AGENT] Fix LOGIC in src/calculator.py",  status: "FIXED" },
  { file: "src/auth.py",      bug_type: "TYPE_ERROR", line: 41, commit_message: "[AI-AGENT] Fix TYPE_ERROR in src/auth.py",   status: "FIXED" },
];

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function CICDDashboard() {
  const canvasRef = useRef(null);
  const termRef = useRef(null);
  const clockRef = useRef(null);
  const wsRef = useRef(null);
  const pollRef = useRef(null);
  const t0Ref = useRef(null);
  const seenRef = useRef(new Set());
  const timersRef = useRef([]);

  const [repo, setRepo] = useState("");
  const [team, setTeam] = useState("");
  const [lead, setLead] = useState("");
  const [branch, setBranch] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFixes, setShowFixes] = useState(false);
  const [logs, setLogs] = useState([{ id: 0, cursor: true }]);
  const [logDone, setLogDone] = useState(false);
  const [chipState, setChipState] = useState("wait");
  const [elapsed, setElapsed] = useState("0m 00s");
  const [summary, setSummary] = useState({ sv1: "—", sv2: "—", sv2b: "—", sv3: "—", sv4: "—", sv5: "—" });
  const [fixes, setFixes] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [score, setScore] = useState(null);
  const [donutOffset, setDonutOffset] = useState(326);
  const [scoreBars, setScoreBars] = useState({ base: 0, speed: 0, efficiency: 0, total: 0 });
  const [scoreNums, setScoreNums] = useState({ base: "+100", speed: "+0", efficiency: "−0", total: "—", dnum: "—" });
  const [scoreColor, setScoreColor] = useState("var(--red)");

  useParticleCanvas(canvasRef);

  /* branch preview */
  useEffect(() => {
    if (team && lead) {
      setBranch(`${team.toUpperCase().replace(/\s+/g, "_")}_${lead.toUpperCase().replace(/\s+/g, "_")}_AI_Fix`);
    } else setBranch("");
  }, [team, lead]);

  const addLog = useCallback((msg) => {
    setLogs(prev => {
      const filtered = prev.filter(l => !l.cursor);
      return [...filtered, { id: Date.now() + Math.random(), msg }, { id: Date.now() + Math.random() + 1, cursor: true }];
    });
    setTimeout(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, 10);
  }, []);

  const startClock = useCallback(() => {
    t0Ref.current = Date.now();
    clockRef.current = setInterval(() => {
      const e = Math.floor((Date.now() - t0Ref.current) / 1000);
      setElapsed(`${Math.floor(e / 60)}m ${String(e % 60).padStart(2, "0")}s`);
    }, 1000);
  }, []);

  const stopClock = useCallback((sec) => {
    clearInterval(clockRef.current);
    if (sec != null) setElapsed(`${Math.floor(sec / 60)}m ${String(sec % 60).padStart(2, "0")}s`);
  }, []);

  const renderScore = useCallback((sc) => {
    const { base = 100, speed_bonus = 0, efficiency_penalty = 0, total = 100 } = sc;
    const M = 110;
    setScoreNums({ base: `+${base}`, speed: `+${speed_bonus}`, efficiency: `−${efficiency_penalty}`, total, dnum: total });
    setTimeout(() => {
      setScoreBars({ base: (base / M) * 100, speed: (speed_bonus / M) * 100, efficiency: (efficiency_penalty / M) * 100, total: (total / M) * 100 });
      setDonutOffset(326 - (total / M) * 326);
      const c = total >= 100 ? "var(--red3)" : total >= 80 ? "var(--amber)" : "var(--red)";
      setScoreColor(c);
    }, 100);
  }, []);

  const reset = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    if (pollRef.current) clearInterval(pollRef.current);
    if (clockRef.current) clearInterval(clockRef.current);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    seenRef.current.clear();
    setShowResults(false); setShowFixes(false); setLoading(false);
    setErrMsg(""); setLogs([{ id: 0, cursor: true }]); setLogDone(false);
    setChipState("wait"); setElapsed("0m 00s"); setFixes([]); setTimeline([]);
    setScore(null); setDonutOffset(326); setScoreBars({ base: 0, speed: 0, efficiency: 0, total: 0 });
    setScoreNums({ base: "+100", speed: "+0", efficiency: "−0", total: "—", dnum: "—" });
    setSummary({ sv1: "—", sv2: "—", sv2b: "—", sv3: "—", sv4: "—", sv5: "—" });
  }, []);

  const runDemo = useCallback((teamName, leadName) => {
    DEMO_STEPS.forEach(({ d, m }) => {
      const t = setTimeout(() => addLog(m), d);
      timersRef.current.push(t);
    });

    timersRef.current.push(setTimeout(() => setSummary(p => ({ ...p, sv4: "4" })), 4500));
    timersRef.current.push(setTimeout(() => {
      setSummary(p => ({ ...p, sv5: "4" }));
      setShowFixes(true);
      setFixes(DEMO_FIXES);
      setTimeline([{ iteration: 1, status: "FAILED", timestamp: new Date().toISOString(), failures_remaining: 4 }]);
    }, 11400));
    // Iteration 1 appears at 7s
    timersRef.current.push(setTimeout(() => {
      setTimeline([
        { iteration: 1, status: "FAILED", timestamp: new Date(Date.now()).toISOString(), failures_remaining: 4 },
      ]);
    }, 7000));

    // Iteration 2 appears at 9s
    timersRef.current.push(setTimeout(() => {
      setTimeline(prev => [...prev,
        { iteration: 2, status: "FAILED", timestamp: new Date().toISOString(), failures_remaining: 3 },
      ]);
    }, 9000));

    // Iteration 3 appears at 11s
    timersRef.current.push(setTimeout(() => {
      setTimeline(prev => [...prev,
        { iteration: 3, status: "FAILED", timestamp: new Date().toISOString(), failures_remaining: 2 },
      ]);
    }, 11000));

    // Iteration 4 appears at 13s
    timersRef.current.push(setTimeout(() => {
      setTimeline(prev => [...prev,
        { iteration: 4, status: "FAILED", timestamp: new Date().toISOString(), failures_remaining: 1 },
      ]);
    }, 13000));

    // Iteration 5 PASSED — final
    timersRef.current.push(setTimeout(() => {
      setTimeline(prev => [...prev,
        { iteration: 5, status: "PASSED", timestamp: new Date().toISOString(), failures_remaining: 0 },
      ]);
      renderScore({ base: 100, speed_bonus: 10, efficiency_penalty: 0, total: 110 });
      setChipState("pass");
      stopClock(null);
      setElapsed("4m 12s");
      setLoading(false);
      setLogDone(true);
    }, 14600));
  }, [addLog, renderScore, stopClock]);

  const paint = useCallback((run) => {
    if (run.total_failures != null) setSummary(p => ({ ...p, sv4: String(run.total_failures) }));
    if (run.total_fixes != null) setSummary(p => ({ ...p, sv5: String(run.total_fixes) }));
    if (run.logs) run.logs.forEach(l => { if (!seenRef.current.has(l)) { seenRef.current.add(l); addLog(l); } });
    if (run.fixes?.length) { setShowFixes(true); setFixes(run.fixes); }
    if (run.ci_timeline) setTimeline(run.ci_timeline);
    if (run.score) renderScore(run.score);
    if (run.status === "COMPLETED" || run.status === "FAILED") {
      setChipState(run.ci_status === "PASSED" ? "pass" : "fail");
      stopClock(run.elapsed_seconds);
      setLoading(false); setLogDone(true);
      addLog(run.ci_status === "PASSED" ? "🎉 All tests passing — mission accomplished!" : "⚠️ Max iterations reached — check remaining issues.");
    }
  }, [addLog, renderScore, stopClock]);

  const go = useCallback(async () => {
    if (!repo || !team || !lead) { setErrMsg("Please fill in all three fields to launch the agent."); return; }
    setErrMsg(""); setLoading(true);
    setShowResults(true); setLogDone(false);
    setSummary({ sv1: repo.replace("https://github.com/", ""), sv2: team, sv2b: lead, sv3: branch || "—", sv4: "—", sv5: "—" });
    setChipState("run"); startClock();
    addLog(`🚀 Launching agent for ${repo}`);
    addLog(`👥 Team: ${team} | Leader: ${lead}`);
    addLog(`🌿 Target branch: ${branch}`);
    addLog("🔌 Connecting to backend...");

    const API = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      ? "http://localhost:8000"
      : (window.__API__ || "http://localhost:8000");

    try {
      const r = await fetch(`${API}/api/run-agent`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repo, team_name: team, leader_name: lead }),
      });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      addLog(`✅ Run queued — ID: ${d.run_id.slice(0, 8)}...`);
      const base = API.replace("https://", "wss://").replace("http://", "ws://");
      const ws = new WebSocket(`${base}/ws/${d.run_id}`);
      wsRef.current = ws;
      ws.onmessage = e => paint(JSON.parse(e.data));
      ws.onerror = () => {
        addLog("🔄 WebSocket failed — polling API");
        pollRef.current = setInterval(async () => {
          const res = await fetch(`${API}/api/run/${d.run_id}`);
          const data = await res.json(); paint(data);
          if (data.status === "COMPLETED" || data.status === "FAILED") clearInterval(pollRef.current);
        }, 2000);
      };
    } catch {
      addLog("⚡ Backend offline — engaging DEMO mode");
      runDemo(team, lead);
    }
  }, [repo, team, lead, branch, addLog, startClock, paint, runDemo]);

  /* ── chip map ── */
  const chipMap = {
    pass: "✓ PASSED", fail: "✗ FAILED", run: "⟳ RUNNING", wait: "⏳ PENDING",
  };

  /* ── timeline render ── */
  const MAX_ITER = 5;
  const tlRows = [...timeline];
  while (tlRows.length < MAX_ITER) tlRows.push(null);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <canvas ref={canvasRef} id="bgCanvas" />

      <div className="app">
        {/* NAVBAR */}
        <nav className="rift-nav">
          <div className="nav-logo">
            <div className="logo-gem">R</div>
            <div className="logo-text">
              <div className="logo-title">RIFT '26 — CI/CD AGENT</div>
              <div className="logo-sub">Autonomous Healing · AI/ML Track</div>
            </div>
          </div>
          <div className="nav-ticker">
            <span className="ticker-dot" />
            PAN INDIA &nbsp;·&nbsp; BENGALURU &nbsp;·&nbsp; PUNE &nbsp;·&nbsp; NOIDA &nbsp;·&nbsp; LUCKNOW
          </div>
          <div className="nav-pill"><span className="pulse" />AGENT ONLINE</div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-glow" />
          <div className="hero-inner">
            <div className="hero-kicker">
              <div className="kicker-line" />
              <span className="kicker-text">DevOps Automation · Agentic Systems · RIFT '26</span>
            </div>
            <h1 className="hero-h1">
              <span className="line1">Autonomous</span>
              <span className="line2">CI/CD Healing</span>
              <span className="line3">Agent</span>
            </h1>
            <p className="hero-desc">
              Detects failures. Generates targeted fixes. Commits with <strong>[AI-AGENT]</strong> prefix.
              Iterates until every test passes — powered by <strong>Claude Sonnet + LangGraph</strong> multi-agent architecture.
            </p>
            <div className="hero-tags">
              {["LangGraph","Claude Sonnet","FastAPI"].map(t => <span key={t} className="htag hot">{t}</span>)}
              {["React · Vite","Docker Sandbox","GitHub Actions","WebSockets","pytest · flake8"].map(t => <span key={t} className="htag cool">{t}</span>)}
            </div>
          </div>

          <svg className="hero-nodes" viewBox="0 0 420 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="210" cy="80" r="6" fill="#e8192c" opacity="0.6">
              <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="120" cy="180" r="4" fill="#7a0e22" opacity="0.5"><animate attributeName="r" values="4;7;4" dur="2.5s" repeatCount="indefinite"/></circle>
            <circle cx="300" cy="160" r="5" fill="#e8192c" opacity="0.4"><animate attributeName="r" values="5;8;5" dur="1.8s" repeatCount="indefinite"/></circle>
            <circle cx="180" cy="280" r="3" fill="#ff6575" opacity="0.5"><animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite"/></circle>
            <circle cx="350" cy="280" r="4" fill="#7a0e22" opacity="0.4"><animate attributeName="r" values="4;6;4" dur="2.2s" repeatCount="indefinite"/></circle>
            <line x1="210" y1="80" x2="120" y2="180" stroke="#7a0e22" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
            <line x1="210" y1="80" x2="300" y2="160" stroke="#e8192c" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
            <line x1="120" y1="180" x2="180" y2="280" stroke="#7a0e22" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
            <line x1="300" y1="160" x2="350" y2="280" stroke="#e8192c" strokeWidth="1" strokeDasharray="4 4" opacity="0.25"/>
            <line x1="180" y1="280" x2="350" y2="280" stroke="#7a0e22" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
            <text x="205" y="68" fill="#e8192c" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.8">ANALYZE</text>
            <text x="100" y="172" fill="#ff6575" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">TEST</text>
            <text x="320" y="152" fill="#ff6575" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">FIX</text>
            <text x="178" y="300" fill="#e8192c" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">COMMIT</text>
            <text x="358" y="300" fill="#ff6575" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">VERIFY</text>
          </svg>
        </div>

        {/* MAIN */}
        <main className="rift-main">

          {/* 01 INPUT */}
          <section>
            <div className="sh">
              <div className="sl"><span className="sn">01</span> Configure Agent Run</div>
            </div>
            <div className="gc input-wrap">
              <div className="input-grid">
                <div className="fld">
                  <div className="flabel"><span className="flabel-dot"/>GitHub Repository URL</div>
                  <input className="finput" type="url" value={repo} onChange={e => setRepo(e.target.value)} placeholder="https://github.com/username/repository" disabled={loading}/>
                </div>
                <div className="fld">
                  <div className="flabel"><span className="flabel-dot"/>Team Name</div>
                  <input className="finput" type="text" value={team} onChange={e => setTeam(e.target.value)} placeholder="e.g. RIFT ORGANISERS" disabled={loading}/>
                </div>
                <div className="fld">
                  <div className="flabel"><span className="flabel-dot"/>Team Leader Name</div>
                  <input className="finput" type="text" value={lead} onChange={e => setLead(e.target.value)} placeholder="e.g. Saiyam Kumar" disabled={loading}/>
                </div>
              </div>

              {branch && (
                <div className="branch-bar">
                  <span className="bb-label">🌿 Branch →</span>
                  <code className="bb-val">{branch}</code>
                </div>
              )}
              {errMsg && (
                <div className="err-bar"><span>⚠</span><span>{errMsg}</span></div>
              )}

              <div className="input-actions">
                <span className="action-hint">Agent runs fully autonomously · no human intervention during execution</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {showResults && <button className="btn-new" onClick={reset}>↺ New Run</button>}
                  <button className={`btn-run${loading ? " busy" : ""}`} onClick={go} disabled={loading}>
                    {loading ? <><span className="spin"/>&nbsp;Agent Running...</> : <><span>▶</span> Launch Agent</>}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RESULTS */}
          {showResults && (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

              {/* 02 SUMMARY */}
              <section>
                <div className="sh">
                  <div className="sl"><span className="sn">02</span> Run Summary</div>
                  <div className={`gchip ${chipState}`}>{chipMap[chipState]}</div>
                </div>
                <div className="gc" style={{ overflow: "hidden" }}>
                  <div className="summary-grid">
                    <div className="sc"><div className="sc-l">Repository</div><div className="sc-v mono">{summary.sv1}</div></div>
                    <div className="sc">
                      <div className="sc-l">Team</div>
                      <div className="sc-v">{summary.sv2}</div>
                      <div className="sc-sub">{summary.sv2b}</div>
                    </div>
                    <div className="sc"><div className="sc-l">Branch Created</div><div className="sc-v mono" style={{ fontSize: 10 }}>{summary.sv3}</div></div>
                    <div className="sc"><div className="sc-l">Failures Found</div><div className="sc-v giant neg">{summary.sv4}</div></div>
                    <div className="sc"><div className="sc-l">Fixes Applied</div><div className="sc-v giant pos">{summary.sv5}</div></div>
                    <div className="sc"><div className="sc-l">Time Taken</div><div className="sc-v tval">{elapsed}</div></div>
                  </div>
                </div>
              </section>

              {/* 03 SCORE + 05 TIMELINE */}
              <div className="dual">
                {/* Score */}
                <section>
                  <div className="sh"><div className="sl"><span className="sn">03</span> Score Breakdown</div></div>
                  <div className="gc score-inner">
                    <div className="score-top">
                      <div className="donut">
                        <svg className="donut-svg" viewBox="0 0 130 130">
                          <circle className="donut-bg" cx="65" cy="65" r="52"/>
                          <circle className="donut-fg" cx="65" cy="65" r="52"
                            style={{ strokeDashoffset: donutOffset, stroke: scoreColor }}/>
                        </svg>
                        <div className="donut-val">
                          <span className="dv-num" style={{ color: scoreColor }}>{scoreNums.dnum}</span>
                          <span className="dv-cap">/ 110 pts</span>
                        </div>
                      </div>
                      <div className="score-breakdown">
                        <div className="sr">
                          <div className="sr-name">Base Score<em>Starting points</em></div>
                          <div className="sr-bar"><div className="sr-fill" style={{ width: `${scoreBars.base}%`, background: "#5577ff" }}/></div>
                          <div className="sr-pts p">{scoreNums.base}</div>
                        </div>
                        <div className="sr">
                          <div className="sr-name">Speed Bonus<em>Completed &lt; 5 minutes</em></div>
                          <div className="sr-bar"><div className="sr-fill" style={{ width: `${scoreBars.speed}%`, background: "var(--green)" }}/></div>
                          <div className="sr-pts p">{scoreNums.speed}</div>
                        </div>
                        <div className="sr">
                          <div className="sr-name">Efficiency Penalty<em>−2 per commit over 20</em></div>
                          <div className="sr-bar"><div className="sr-fill" style={{ width: `${scoreBars.efficiency}%`, background: "var(--red)" }}/></div>
                          <div className="sr-pts n">{scoreNums.efficiency}</div>
                        </div>
                        <div className="sr-div"/>
                        <div className="sr">
                          <div className="sr-name" style={{ color: "var(--text)", fontWeight: 700, fontSize: 14 }}>Total Score</div>
                          <div className="sr-bar"><div className="sr-fill" style={{ width: `${scoreBars.total}%`, background: scoreColor }}/></div>
                          <div className="sr-pts t" style={{ color: scoreColor }}>{scoreNums.total}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Timeline */}
                <section>
                  <div className="sh">
                    <div className="sl"><span className="sn">05</span> CI/CD Timeline</div>
                    <div className="ib">{timeline.length} / {MAX_ITER} iterations</div>
                  </div>
                  <div className="gc tl-inner">
                    {timeline.length === 0 ? (
                      <div className="tl-empty">
                        <div className="tl-empty-ico">🚦</div>
                        <span>Waiting for first CI/CD run...</span>
                      </div>
                    ) : (
                      <div className="tl-list">
                        {tlRows.map((e, i) => e ? (
                          <div className="tl-row" key={i}>
                            <div className="tl-spine">
                              <div className={`tl-dot ${e.status === "PASSED" ? "ok" : "bad"}`}>{e.status === "PASSED" ? "✓" : "✗"}</div>
                              {i < tlRows.length - 1 && <div className={`tl-line ${e.status === "PASSED" ? "ok" : "bad"}`}/>}
                            </div>
                            <div className="tl-body">
                              <div className="tl-head">
                                <span className={`tl-chip ${e.status === "PASSED" ? "ok" : "bad"}`}>{e.status}</span>
                                <span className="tl-run">Run #{e.iteration}</span>
                              </div>
                              <div className="tl-meta">
                                <span>{new Date(e.timestamp).toLocaleTimeString()}</span>
                                {e.failures_remaining > 0 && <span className="tl-rem">{e.failures_remaining} remaining</span>}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="tl-row" key={i}>
                            <div className="tl-spine">
                              <div className="tl-dot dim">·</div>
                              {i < MAX_ITER - 1 && <div className="tl-line"/>}
                            </div>
                            <div className="tl-ghost">Iteration {i + 1} (pending)</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* 04 FIXES TABLE */}
              {showFixes && (
                <section>
                  <div className="sh">
                    <div className="sl"><span className="sn">04</span> Fixes Applied</div>
                    <div className="ib">{fixes.length} fix{fixes.length === 1 ? "" : "es"}</div>
                  </div>
                  <div className="tscroll">
                    <table>
                      <thead><tr><th>File</th><th>Bug Type</th><th>Line</th><th>Commit Message</th><th>Status</th></tr></thead>
                      <tbody>
                        {fixes.map((f, i) => (
                          <tr key={i} className={f.status === "FIXED" ? "rp" : "rf"}>
                            <td><code className="fcode">{f.file}</code></td>
                            <td><span className={`bchip b-${f.bug_type}`}>{f.bug_type}</span></td>
                            <td><span className="lnum">{f.line || "—"}</span></td>
                            <td><span className="cmsg">{f.commit_message}</span></td>
                            <td><span className={`fstat ${f.status === "FIXED" ? "ok" : "bad"}`}>{f.status === "FIXED" ? "✓ Fixed" : "✗ Failed"}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* 06 AGENT LOGS */}
              <section>
                <div className="sh">
                  <div className="sl"><span className="sn">06</span> Agent Logs</div>
                  <div className="live-badge">
                    <span className="pulse" style={{ background: "var(--red3)", boxShadow: "none" }}/>
                    {logDone ? "✓ DONE" : "LIVE"}
                  </div>
                </div>
                <div className="term">
                  <div className="term-bar">
                    <div className="tcc">
                      <span className="td-dot" style={{ background: "#ff5f57" }}/>
                      <span className="td-dot" style={{ background: "#febc2e" }}/>
                      <span className="td-dot" style={{ background: "#28c840" }}/>
                    </div>
                    <div className="term-title">ai-agent@rift26 — autonomous-ci-healer — bash</div>
                  </div>
                  <div className="term-body" ref={termRef}>
                    {logs.map(l => (
                      <div className="ll" key={l.id}>
                        <span className="lp">❯</span>
                        {l.cursor ? <span className="lc">█</span> : <span className="lt">{l.msg}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="rift-footer">
          <div className="foot-l">
            <span>Claude Sonnet + LangGraph</span>
            <span>4-Node Multi-Agent</span>
            <span>Docker Sandboxed</span>
            <span>FastAPI + WebSockets</span>
            <span>React · Vite · Vercel</span>
          </div>
          <div className="foot-r">
            <span className="foot-badge">RIFT '26 · PW IOI · AI/ML Track</span>
          </div>
        </footer>
      </div>
    </>
  );
}
