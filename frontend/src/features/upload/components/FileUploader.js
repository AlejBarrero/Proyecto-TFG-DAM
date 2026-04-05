import { useRef } from 'react';
import { usePdfUpload } from '../hooks/usePdfUpload';
import UploadDropZone from './UploadDropZone';
import UploadActions from './UploadActions';
import UploadError from './UploadError';
import DocumentMetadataForm from './DocumentMetadataForm';
import AudioResultCard from '../../audio/components/AudioResultCard';

const maxSizeMb = 10;

export default function FileUploader({ isAuthenticated = false, onUploadSuccess }) {
  const inputRef = useRef(null);

  const {
    file,
    metadata,
    response,
    loading,
    error,
    selectFile,
    updateMetadata,
    upload,
    reset,
  } = usePdfUpload({
    isAuthenticated,
    onUploadSuccess,
  });

  const handleInputChange = (e) => {
    selectFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    await upload();
  };

  const handleReset = () => {
    reset();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <section className="w-full">
      {!response && (
        <div className="w-full max-w-3xl rounded-[28px] border border-white/60 bg-white/95 p-8 shadow-panel backdrop-blur sm:p-10">
          <p className="mb-6 text-sm leading-6 text-slate-500">
            {isAuthenticated
              ? 'Modo usuario: el documento se procesa y se guarda en tu cuenta.'
              : 'Modo invitado: el documento se procesa, pero no se guarda en la base de datos.'}
          </p>
          <div className="space-y-5">
            <UploadDropZone
              file={file}
              inputRef={inputRef}
              onInputChange={handleInputChange}
              maxSizeMb={maxSizeMb}
            />
            {isAuthenticated && (
              <DocumentMetadataForm
                metadata={metadata}
                onChange={updateMetadata}
                disabled={loading}
              />
            )}
            <UploadActions loading={loading} disabled={loading || !file} onUpload={handleUpload} />
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 w-full max-w-3xl">
          <UploadError message={error} />
        </div>
      )}
      {response && (
        <div className="mt-4">
          <AudioResultCard response={response} onReset={handleReset} />
        </div>
      )}
    </section>
  );
}
