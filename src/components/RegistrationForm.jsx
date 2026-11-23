import { useEffect, useId, useState } from 'react';
import { EVENT, WHATSAPP_NUMBER, PRIVACY_URL } from '../config.js';
import { verifyMemberCode, register, isEmail, onlyDigits } from '../lib.js';

const STORAGE_KEY = 'fdb-registro';
const DISCIPLINAS = ['CrossFit', 'Powerlifting', 'Halterofilia', 'Hyrox', 'Soy coach', 'Otro'];

const empty = {
  nombre: '',
  whatsapp: '',
  email: '',
  disciplina: '',
  tipo: '', // 'miembro' | 'externo'
  codigo: '',
  privacidad: false,
};

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function Field({ id, label, error, hint, children }) {
  return (
    <div className={'field' + (error ? ' field--error' : '')}>
      <label htmlFor={id} className="field__label">{label}</label>
      {children}
      {hint && !error && <p id={id + '-hint'} className="field__hint">{hint}</p>}
      {error && <p id={id + '-err'} className="field__error" role="alert">{error}</p>}
    </div>
  );
}

export default function RegistrationForm() {
  const uid = useId();
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState({});
  const [codeStatus, setCodeStatus] = useState('idle'); // idle | checking | ok | bad
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setDone(JSON.parse(saved));
    } catch {}
  }, []);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setV((p) => ({ ...p, [k]: val }));
    setErrors((p) => ({ ...p, [k]: undefined }));
    if (k === 'codigo') setCodeStatus('idle');
  };

  const checkCode = async () => {
    if (!v.codigo.trim()) return false;
    setCodeStatus('checking');
    try {
      const ok = await verifyMemberCode(v.codigo);
      setCodeStatus(ok ? 'ok' : 'bad');
      return ok;
    } catch {
      setCodeStatus('idle');
      return null; // sin conexión: lo valida el servidor al enviar
    }
  };

  const isMember = v.tipo === 'miembro';
  const price = isMember ? EVENT.priceMember : EVENT.priceExternal;

  const validate = async () => {
    const e = {};
    if (v.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre completo.';
    if (onlyDigits(v.whatsapp).length !== 10) e.whatsapp = 'Escribe tu WhatsApp a 10 dígitos.';
    if (!isEmail(v.email)) e.email = 'Revisa tu correo.';
    if (!v.tipo) e.tipo = 'Elige una opción.';
    if (isMember) {
      if (!v.codigo.trim()) e.codigo = 'Escribe el código que te dieron en Cupra.';
      else if ((await checkCode()) === false)
        e.codigo = 'Ese código no es válido. Pídelo en recepción de Cupra o regístrate como externo.';
    }
    if (!v.privacidad) e.privacidad = 'Necesitamos tu autorización para registrarte.';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (sending) return;
    const e = await validate();
    setErrors(e);
    const firstKey = Object.keys(e)[0];
    if (firstKey) {
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }
    setSending(true);
    const payload = {
      nombre: v.nombre.trim(),
      whatsapp: onlyDigits(v.whatsapp),
      email: v.email.trim().toLowerCase(),
      disciplina: v.disciplina,
      tipo: v.tipo,
      codigo: isMember ? v.codigo : '',
    };
    try {
      const res = await register(payload);
      if (!res.ok) {
        if (res.error === 'codigo') {
          setCodeStatus('bad');
          setErrors({ codigo: 'Ese código no es válido. Pídelo en recepción de Cupra o regístrate como externo.' });
          document.getElementById(`${uid}-codigo`)?.focus();
        } else if (res.error === 'datos') {
          setErrors({ form: 'Revisa tu nombre, WhatsApp y correo e inténtalo de nuevo.' });
        } else {
          setErrors({ form: 'No pudimos guardar tu registro. Inténtalo de nuevo en unos minutos.' });
        }
        return;
      }
      const result = { folio: res.folio, nombre: payload.nombre, tipo: res.tipo, monto: res.monto, payLink: res.payLink };
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result)); } catch {}
      setDone(result);
      requestAnimationFrame(() =>
        document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } catch {
      setErrors({ form: 'No pudimos enviar tu registro. Revisa tu conexión e inténtalo de nuevo.' });
    } finally {
      setSending(false);
    }
  };

  if (done) {
    const payLink = done.payLink;
    const waText = encodeURIComponent(
      `Hola, ya pagué mi lugar para "${EVENT.name}". Folio ${done.folio} · ${done.nombre} · $${done.monto} MXN. Te comparto mi comprobante.`
    );
    return (
      <div className="card success" aria-live="polite">
        <p className="success__step">Paso 1 de 2 listo</p>
        <h3 className="success__title">¡Registro recibido, {done.nombre.split(' ')[0]}!</h3>
        <p className="success__folio">
          Tu folio: <strong>{done.folio}</strong>
        </p>

        <div className="success__pay">
          <p className="success__step">Paso 2: paga tu lugar</p>
          <p className="success__amount">${done.monto} MXN</p>
          <a className="btn btn--mp btn--lg btn--block" href={payLink} target="_blank" rel="noopener noreferrer">
            Pagar con Mercado Pago
          </a>
          <p className="field__hint">Tarjeta, OXXO o saldo de Mercado Pago. Se abre en otra pestaña.</p>
        </div>

        <p className="success__note">
          Tu lugar queda confirmado cuando validemos tu pago. Después de pagar, mándanos tu comprobante con tu folio:
        </p>
        <a
          className="btn btn--outline btn--block"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enviar comprobante por WhatsApp
        </a>

        <button
          type="button"
          className="link-btn"
          onClick={() => {
            try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
            setDone(null);
            setV(empty);
            setCodeStatus('idle');
          }}
        >
          Registrar a otra persona
        </button>
      </div>
    );
  }

  const id = (k) => `${uid}-${k}`;
  const describedBy = (k, hasHint) => (errors[k] ? id(k) + '-err' : hasHint ? id(k) + '-hint' : undefined);

  return (
    <form className="card form" onSubmit={onSubmit} noValidate>
      <Field id={id('nombre')} label="Nombre completo" error={errors.nombre}>
        <input
          id={id('nombre')} className="input" type="text" autoComplete="name"
          value={v.nombre} onChange={set('nombre')}
          aria-invalid={!!errors.nombre} aria-describedby={describedBy('nombre')}
        />
      </Field>

      <Field id={id('whatsapp')} label="WhatsApp" error={errors.whatsapp} hint="10 dígitos.">
        <input
          id={id('whatsapp')} className="input" type="tel" inputMode="numeric" autoComplete="tel-national"
          placeholder="999 123 4567"
          value={v.whatsapp} onChange={set('whatsapp')}
          aria-invalid={!!errors.whatsapp} aria-describedby={describedBy('whatsapp', true)}
        />
      </Field>

      <Field id={id('email')} label="Correo" error={errors.email}>
        <input
          id={id('email')} className="input" type="email" inputMode="email" autoComplete="email"
          value={v.email} onChange={set('email')}
          aria-invalid={!!errors.email} aria-describedby={describedBy('email')}
        />
      </Field>

      <Field id={id('disciplina')} label="¿Qué entrenas? (opcional)">
        <select id={id('disciplina')} className="input" value={v.disciplina} onChange={set('disciplina')}>
          <option value="">Elige una opción</option>
          {DISCIPLINAS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>

      <fieldset className={'field' + (errors.tipo ? ' field--error' : '')} aria-describedby={errors.tipo ? id('tipo') + '-err' : undefined}>
        <legend className="field__label">¿Eres miembro activo de CrossFit Cupra?</legend>
        <div className="options">
          <label className={'option option--pink' + (v.tipo === 'miembro' ? ' is-checked' : '')}>
            <input id={id('tipo')} type="radio" name="tipo" value="miembro" checked={v.tipo === 'miembro'} onChange={set('tipo')} />
            <span className="option__title">Sí, soy miembro activo</span>
            <span className="option__price">${EVENT.priceMember} MXN</span>
          </label>
          <label className={'option option--orange' + (v.tipo === 'externo' ? ' is-checked' : '')}>
            <input type="radio" name="tipo" value="externo" checked={v.tipo === 'externo'} onChange={set('tipo')} />
            <span className="option__title">No, vengo de fuera</span>
            <span className="option__price">${EVENT.priceExternal} MXN</span>
          </label>
        </div>
        {errors.tipo && <p id={id('tipo') + '-err'} className="field__error" role="alert">{errors.tipo}</p>}
      </fieldset>

      {isMember && (
        <Field id={id('codigo')} label="Código de verificación de Cupra" error={errors.codigo} hint="Te lo dan en recepción o en el grupo de miembros.">
          <div className="code-row">
            <input
              id={id('codigo')} className="input" type="text" autoComplete="off" autoCapitalize="none" spellCheck="false"
              value={v.codigo} onChange={set('codigo')} onBlur={checkCode}
              aria-invalid={!!errors.codigo || codeStatus === 'bad'} aria-describedby={describedBy('codigo', true)}
            />
            {codeStatus === 'ok' && (
              <span className="code-ok" role="status"><Check /> Verificado</span>
            )}
          </div>
          {codeStatus === 'bad' && !errors.codigo && (
            <p className="field__error" role="alert">Ese código no coincide. Revísalo o regístrate como externo.</p>
          )}
        </Field>
      )}

      <div className={'field field--check' + (errors.privacidad ? ' field--error' : '')}>
        <label className="check">
          <input
            id={id('privacidad')} type="checkbox" checked={v.privacidad} onChange={set('privacidad')}
            aria-invalid={!!errors.privacidad} aria-describedby={errors.privacidad ? id('privacidad') + '-err' : undefined}
          />
          <span>
            Acepto el <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">aviso de privacidad</a> y que me contacten por WhatsApp sobre el taller.
          </span>
        </label>
        {errors.privacidad && <p id={id('privacidad') + '-err'} className="field__error" role="alert">{errors.privacidad}</p>}
      </div>

      <div className="summary" aria-live="polite">
        <span>Total a pagar</span>
        <strong>{v.tipo ? `$${price} MXN` : '—'}</strong>
      </div>

      {errors.form && <p className="field__error" role="alert">{errors.form}</p>}

      <button type="submit" className="btn btn--ink btn--lg btn--block" disabled={sending}>
        {sending ? 'Enviando…' : 'Registrarme y pasar al pago'}
      </button>
    </form>
  );
}
