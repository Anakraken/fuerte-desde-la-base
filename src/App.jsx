import { useEffect, useRef, useState } from 'react';
import { EVENT } from './config.js';
import RegistrationForm from './components/RegistrationForm.jsx';

const LEARN = [
  'Por qué aparecen las fugas al levantar, reír, brincar o estornudar, y las señales de alerta',
  'Respiración, bracing y manejo de la presión intraabdominal',
  'Ejercicios de fuerza, coordinación y relajación',
  'Nutrición y herbolaria: qué sí funciona y qué no',
];

const STAGES = [
  'Posparto y regreso al deporte',
  'Perimenopausia y menopausia',
  'Prolapso en atletas',
  'Incontinencia anal',
];

const FOR_WHO = ['CrossFit', 'Powerlifting', 'Halterofilia', 'Hyrox'];

export default function App() {
  const formRef = useRef(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = formRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className="hero">
        <div className="hero__photo-wrap">
          <img
            className="hero__photo"
            src={`${import.meta.env.BASE_URL}anakaren-gym.jpg`}
            alt="Anakaren estirando con una barra en el gimnasio"
            width="1485"
            height="992"
          />
          <img className="hero__logo" src={`${import.meta.env.BASE_URL}logo-cupra.png`} alt="CrossFit Cupra" width="88" height="88" />
          <span className="pill pill--yellow hero__tag">Taller presencial</span>
        </div>

        <div className="container hero__body">
          <h1 className="hero__title">
            Fuerte <span>desde la base</span>
          </h1>
          <p className="hero__subtitle">{EVENT.subtitle}</p>
          <p className="hero__meta">
            <span className="pill pill--ink">{EVENT.dateShort}</span>
            <span className="pill pill--cream">{EVENT.place}</span>
          </p>
          <a className="btn btn--ink btn--lg" href="#registro">
            Reservar mi lugar
          </a>
        </div>
      </header>

      <div className="stripe" aria-hidden="true" />

      <section className="manifesto">
        <div className="container">
          <p className="manifesto__text">
            No tienes que elegir entre <mark>hacer ejercicio</mark> y tu suelo pélvico, aprende a cuidarlo.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="aprende-t">
        <div className="container">
          <h2 id="aprende-t" className="section__title">Qué vas a aprender</h2>
          <ol className="learn">
            {LEARN.map((t, i) => (
              <li key={t} className="learn__item">
                <span className="learn__num">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <p className="for-who">
            <span className="for-who__label">Para ti si haces</span>
            {FOR_WHO.map((x) => (
              <span key={x} className="chip">{x}</span>
            ))}
          </p>
        </div>
      </section>

      <section className="section section--peach" aria-labelledby="etapas-t">
        <div className="container">
          <h2 id="etapas-t" className="section__title">Bonus: lo que nadie te cuenta</h2>
          <ul className="stages">
            {STAGES.map((t) => (
              <li key={t} className="stages__item">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="detalles-t">
        <div className="container">
          <h2 id="detalles-t" className="section__title">Detalles</h2>
          <dl className="details">
            <div className="details__item details__item--yellow">
              <dt>Fecha</dt>
              <dd>{EVENT.dateLong}</dd>
            </div>
            <div className="details__item">
              <dt>Horario</dt>
              <dd>{EVENT.time}</dd>
            </div>
            <div className="details__item">
              <dt>Lugar</dt>
              <dd>{EVENT.place}</dd>
            </div>
            <div className="details__item">
              <dt>Cupo</dt>
              <dd>{EVENT.spots}</dd>
            </div>
          </dl>

          <div className="prices">
            <div className="price price--pink">
              <span className="price__amount">${EVENT.priceMember}</span>
              <span className="price__label">MXN · Miembros activos de CrossFit Cupra</span>
              <span className="price__note">Con código de verificación</span>
            </div>
            <div className="price price--orange">
              <span className="price__amount">${EVENT.priceExternal}</span>
              <span className="price__label">MXN · Externos</span>
              <span className="price__note">Abierto al público</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="imparte-t">
        <div className="container">
          <div className="coach">
            <img className="coach__photo" src={`${import.meta.env.BASE_URL}anakaren-retrato.jpg`} alt="Anakaren R. Tamayo" width="160" height="160" />
            <div>
              <h2 id="imparte-t" className="coach__kicker">Imparte</h2>
              <p className="coach__name">{EVENT.instructor}</p>
              <p className="coach__bio">Bicampeona nacional de Powerlifting, coach de CrossFit y Powerlifting con 10 años de experiencia en deportes de fuerza.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="registro" className="section section--blue" aria-labelledby="registro-t" ref={formRef}>
        <div className="container container--narrow">
          <h2 id="registro-t" className="section__title">Reserva tu lugar</h2>
          <RegistrationForm />
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <img src={`${import.meta.env.BASE_URL}logo-cupra.png`} alt="CrossFit Cupra" width="56" height="56" />
          <p>
            {EVENT.name} · {EVENT.dateLong} · {EVENT.place}, Mérida
          </p>
        </div>
      </footer>

      <div className={'sticky-cta' + (formVisible ? ' is-hidden' : '')}>
        <div className="sticky-cta__info">
          <strong>{EVENT.dateShort}</strong>
          <span>Desde ${EVENT.priceMember} MXN</span>
        </div>
        <a className="btn btn--ink" href="#registro" tabIndex={formVisible ? -1 : 0}>
          Reservar
        </a>
      </div>
    </>
  );
}
