import FileUploader from './components/FileUploader';
import './App.css';
 
function App() {
  return (
    <div className="app-container">
      <header className="app-header" role="banner">
        <h1 className="app-title">PDF2Voice</h1>
        <p className="app-subtitle">
          Converti documentos PDF a audio en español automáticamente
        </p>
        <p className="app-description">
           Máximo 10 MB. (Unicamente PDFs en ingles y español... por ahora).
        </p>
      </header>
      <main role="main">
        <FileUploader />
      </main>
      <footer className="app-footer" role="contentinfo">
        <p>PDF2Voice - Proyecto TFG DAM de Alejandro y Diego - 2026</p>
      </footer>
    </div>
  );
}
 
export default App;


