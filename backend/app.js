import FileUploader from './components/FileUploader';
import './App.css';
import logo from './assets/logo.png';

function App() {
    return (
    <div className="app-container">
        <header className="app-header" role="banner">
        <img src={logo} alt="PDF2Voice Logo" className="app-logo" />
        <h1 className="app-title">PDF2Voice</h1>
        <p className="app-subtitle">
            Convierte documentos PDF en audio en español automáticamente
        </p>
        <p className="app-description">
            Soporta documentos en <strong>inglés</strong> (se traducen automáticamente) y{' '}
            <strong>español</strong>. Máximo 10 MB.
        </p>
        </header>
        <main role="main">
        <FileUploader />
        </main>
        <footer className="app-footer" role="contentinfo">
        <p>PDF2Voice &mdash; Proyecto TFG DAM &mdash; 2025</p>
        </footer>
    </div>
    );
}

export default App;
