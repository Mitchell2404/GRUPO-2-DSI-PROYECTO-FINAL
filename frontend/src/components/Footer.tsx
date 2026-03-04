import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>📍 Ubicación</h3>
          <p>Av. Universitaria s/n</p>
          <p>Lima, Perú</p>
        </div>

        <div className="footer-section">
          <h3>📞 Contacto</h3>
          <p>Teléfono: (01) 619-7000</p>
          <p>Email: mesadeayuda@unmsm.edu.pe</p>
        </div>

        <div className="footer-section">
          <h3>🕐 Horario</h3>
          <p>Lunes a Viernes</p>
          <p>8:00 AM - 5:00 PM</p>
        </div>

        <div className="footer-section">
          <h3>🔗 Enlaces</h3>
          <p><a href="https://unmsm.edu.pe" target="_blank" rel="noopener noreferrer">Portal UNMSM</a></p>
          <p><a href="https://sum.unmsm.edu.pe" target="_blank" rel="noopener noreferrer">SUM</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Universidad Nacional Mayor de San Marcos - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}