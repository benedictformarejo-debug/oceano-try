import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const G = "'Cormorant Garamond',Georgia,serif";
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, ease, delay },
});

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  /* Hero — split layout */
  .c-hero { display:grid; grid-template-columns:1fr 1fr; min-height:calc(100vh + 1px); margin-top:-80px; position:relative; z-index:0; }
  .c-hero-left { background:#f5f2ec; display:flex; flex-direction:column; justify-content:flex-end; padding:clamp(48px,6vw,96px); padding-top:0; padding-bottom:clamp(56px,7vw,100px); }
  .c-hero-right { position:relative; overflow:hidden; z-index:200; }
  .c-hero-right img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
  @media(max-width:820px){ .c-hero{grid-template-columns:1fr;min-height:auto;} .c-hero-right{height:60vw;} }

  /* Coordinates watermark section */
  .c-coords { position:relative; background:#f5f2ec; overflow:hidden; padding:96px 72px; }
  .c-coords-bg {
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    font-family:${G}; font-size:clamp(5rem,14vw,13rem); font-weight:300;
    color:rgba(30,54,36,0.04); white-space:nowrap; pointer-events:none;
    letter-spacing:-0.02em; line-height:1; user-select:none;
  }
  .c-coords-grid { position:relative; display:grid; grid-template-columns:1fr 1fr 1fr; gap:0; }
  .c-coords-cell { padding:0 48px 0 0; border-right:1px solid rgba(30,54,36,0.1); margin-right:48px; }
  .c-coords-cell:last-child { border-right:none; margin-right:0; padding-right:0; }

  /* Marquee */
  .c-marquee-wrap { overflow:hidden; border-top:1px solid rgba(30,54,36,0.1); border-bottom:1px solid rgba(30,54,36,0.1); padding:18px 0; background:#f5f2ec; }
  .c-marquee { display:flex; gap:0; animation: marquee 22s linear infinite; width:max-content; }
  .c-marquee-item { font-family:${G}; font-size:0.72rem; letter-spacing:0.28em; text-transform:uppercase;
    color:rgba(30,54,36,0.3); padding:0 40px; white-space:nowrap; }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* Image banner with times overlay */
  .c-banner { position:relative; height:52vh; overflow:hidden; }
  .c-banner img { width:100%; height:100%; object-fit:cover; filter:brightness(0.45); display:block; }
  .c-banner-overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:0; }
  .c-time-block { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:12px; height:100%; }
  .c-time-divider { width:1px; height:80px; background:rgba(245,242,236,0.2); align-self:center; }

  /* Getting here + map */
  .c-dark { background:#f5f2ec; display:grid; grid-template-columns:1fr 1fr; min-height:560px; border-top:1px solid rgba(30,54,36,0.1); }
  .c-dark-left { padding:clamp(48px,6vw,80px); display:flex; flex-direction:column; justify-content:center; gap:40px; border-right:1px solid rgba(30,54,36,0.1); }
  .c-dark-map { overflow:hidden; }
  .c-route { display:flex; flex-direction:column; gap:28px; }
  .c-route-item { display:grid; grid-template-columns:40px 1fr; gap:16px; align-items:start; }
  .c-route-num { font-family:${G}; font-size:0.65rem; letter-spacing:0.2em; color:rgba(30,54,36,0.25);
    padding-top:4px; }
  .c-route-text h4 { font-family:${G}; font-size:0.72rem; letter-spacing:0.2em; text-transform:uppercase;
    color:rgba(30,54,36,0.45); margin:0 0 6px; }
  .c-route-text p { font-family:${G}; font-size:clamp(0.95rem,1.2vw,1.1rem); color:rgba(30,54,36,0.68);
    line-height:1.7; margin:0; }

  @media(max-width:820px){
    .c-coords-grid{grid-template-columns:1fr;gap:40px;}
    .c-coords-cell{border-right:none;padding-right:0;margin-right:0;border-bottom:1px solid rgba(30,54,36,0.1);padding-bottom:32px;}
    .c-dark{grid-template-columns:1fr;}
    .c-dark-map{min-height:300px;}
    .c-hero-text{padding:40px 28px;}
    .c-coords{padding:72px 28px;}
  }
`;

const MARQUEE_TEXT = ['Samal Island', '·', 'Davao del Norte', '·', 'Philippines', '·', '7.0287° N', '·', '125.7644° E', '·', 'Est. 2023', '·'];

const Contact = () => (
  <div style={{ minHeight: '100vh', background: '#f5f2ec' }}>
    <style>{css}</style>

    {/* ── Hero ── */}
    <div className="c-hero">
      <div className="c-hero-left">
        <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:1.1, ease, delay:0.15 }}
          style={{ fontFamily:G, fontSize:'clamp(4rem,7vw,8rem)', fontWeight:300,
            color:'#1e3624', letterSpacing:'-0.03em', lineHeight:1.0, margin:'0 0 36px' }}>
          Find Us<br /><em>Above the Sea.</em>
        </motion.h1>
        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }}
          transition={{ duration:1, ease, delay:0.5 }}
          style={{ width:52, height:1, background:'rgba(30,54,36,0.25)', transformOrigin:'left', marginBottom:40 }} />
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.9, ease, delay:0.55 }}
          style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <p style={{ fontFamily:G, fontSize:'0.68rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(30,54,36,0.4)', margin:0 }}>Location</p>
          <p style={{ fontFamily:G, fontSize:'clamp(1.05rem,1.4vw,1.2rem)', color:'rgba(30,54,36,0.72)', lineHeight:1.75, margin:0 }}>
            Purok 6, Island Garden City of Samal<br />Davao del Norte, Philippines
          </p>
        </motion.div>
      </div>
      <div className="c-hero-right">
  <motion.img
    src="/images/IMG_4568.jpg"
    alt="Oceano Con Vista"
    initial={{ opacity: 0, scale: 1.3 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.4, ease }}
    style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}
  />
</div>
    </div>

    {/* ── Coordinates watermark + 3-col info ── */}
    <section className="c-coords">
      <div className="c-coords-bg">7.0287° N &nbsp; 125.7644° E</div>
      <div className="c-coords-grid">
        {[
          { tag: 'Address', val: 'Purok 6, Island Garden\nCity of Samal, Davao del Norte\nPhilippines' },
          { tag: 'Reservations', val: <><a href="tel:+639XXXXXXXXX" style={{ color:'#1e3624', borderBottom:'1px solid rgba(30,54,36,0.2)' }}>+63 9XX XXX XXXX</a><br /><a href="mailto:stay@oceanoconvista.com" style={{ color:'#1e3624', borderBottom:'1px solid rgba(30,54,36,0.2)' }}>stay@oceanoconvista.com</a></> },
          { tag: 'Social', val: <><a href="#" style={{ color:'#1e3624', borderBottom:'1px solid rgba(30,54,36,0.2)' }}>@oceanoconvista</a><br />Instagram · Facebook</> },
        ].map((c, i) => (
          <motion.div key={c.tag} className="c-coords-cell" {...fade(i * 0.1)}>
            <p style={{ fontFamily:G, fontSize:'0.65rem', letterSpacing:'0.26em', textTransform:'uppercase',
              color:'rgba(30,54,36,0.35)', margin:'0 0 16px' }}>{c.tag}</p>
            <p style={{ fontFamily:G, fontSize:'clamp(1rem,1.4vw,1.15rem)', color:'#1e3624',
              lineHeight:1.75, margin:0, whiteSpace:'pre-line', fontWeight:400 }}>{c.val}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── Marquee ── */}
    <div className="c-marquee-wrap">
      <div className="c-marquee">
        {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((t, i) => (
          <span key={i} className="c-marquee-item">{t}</span>
        ))}
      </div>
    </div>

    {/* ── Full-width image with check-in/out overlay ── */}
    <div className="c-banner">
      <img src="/images/IMG_4563.jpg" alt="Resort" />
      <div className="c-banner-overlay">
        {[
          { label: 'Check-in', time: '2:00 PM', note: 'onwards' },
          null,
          { label: 'Check-out', time: '12:00 NN', note: 'at the latest' },
        ].map((block, i) =>
          block === null
            ? <div key={i} className="c-time-divider" />
            : (
              <motion.div key={i} className="c-time-block" {...fade(i * 0.12)}>
                <p style={{ fontFamily:G, fontSize:'0.65rem', letterSpacing:'0.28em', textTransform:'uppercase',
                  color:'rgba(245,242,236,0.45)', margin:0 }}>{block.label}</p>
                <p style={{ fontFamily:G, fontSize:'clamp(2.8rem,6vw,5rem)', fontWeight:300,
                  color:'#f5f2ec', letterSpacing:'-0.02em', margin:0, lineHeight:1 }}>{block.time}</p>
                <p style={{ fontFamily:G, fontSize:'0.72rem', letterSpacing:'0.12em', fontStyle:'italic',
                  color:'rgba(245,242,236,0.4)', margin:0 }}>{block.note}</p>
              </motion.div>
            )
        )}
      </div>
    </div>

    {/* ── Dark panel: getting here + map ── */}
    <div className="c-dark">
      <div className="c-dark-left">
        <motion.p {...fade(0)} style={{ fontFamily:G, fontSize:'0.65rem', letterSpacing:'0.26em',
          textTransform:'uppercase', color:'rgba(30,54,36,0.35)', margin:0 }}>
          Getting Here
        </motion.p>
        <div className="c-route">
          {[
            { n:'01', head:'By Sea', body:'Ferry from Sasa or Santa Ana Wharf, Davao City — 15 to 20 minutes to Babak Port.' },
            { n:'02', head:'By Road', body:'20-minute drive up the hills of Island Garden City from Babak Port to our gate.' },
            { n:'03', head:'By Air',  body:'Francisco Bangoy International Airport (DVO) — 45 minutes combined by land and sea.' },
          ].map((r, i) => (
            <motion.div key={r.n} className="c-route-item" {...fade(0.1 + i * 0.1)}>
              <span className="c-route-num">{r.n}</span>
              <div className="c-route-text">
                <h4>{r.head}</h4>
                <p>{r.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p {...fade(0.45)} style={{ fontFamily:G, fontSize:'clamp(1rem,1.3vw,1.1rem)', fontStyle:'italic',
          color:'rgba(30,54,36,0.35)', lineHeight:1.7, margin:0 }}>
          "The most beautiful arrivals begin with a crossing."
        </motion.p>
      </div>

      <motion.div className="c-dark-map"
        initial={{ opacity:0 }} whileInView={{ opacity:1 }}
        viewport={{ once:true }} transition={{ duration:1.3, ease, delay:0.2 }}>
        <iframe
          title="Oceano Con Vista Location"
          src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d66314.38547938404!2d125.65359788085115!3d7.131189074874158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d7.1207479!2d125.6737143!4m5!1s0x32f97b3c1ebeb72b%3A0x50bffe03d705fc0f!2sOCEANO%20CON%20VISTA%20HIGHLANDS%2C%20PUROK%206%2C%20Brgy%2C%20Samal%2C%20Davao%20del%20Norte!3m2!1d7.028742299999999!2d125.76448479999999!5e0!3m2!1sen!2sph!4v1776487173250!5m2!1sen!2sph"
          width="100%" height="100%"
          style={{ border:0, display:'block', filter:'grayscale(30%) contrast(1.0) brightness(0.75)', minHeight:560 }}
          allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>
    </div>

    {/* ── Footer ── */}
    <div style={{ textAlign:'center', padding:'64px 48px 88px' }}>
      <div style={{ width:38, height:1, background:'rgba(30,54,36,0.18)', margin:'0 auto 20px' }} />
      <p style={{ fontFamily:G, fontSize:'0.72rem', letterSpacing:'0.22em',
        textTransform:'uppercase', color:'rgba(30,54,36,0.28)', margin:0 }}>
        Oceano Con Vista · Samal Island, Philippines
      </p>
    </div>
  </div>
);

export default Contact;