import { useRef } from 'react';
import { usePdfUpload } from '../hooks/usePdfUpload';
import UploadDropZone from './UploadDropZone';
import UploadActions from './UploadActions';
import '../../../main.css';
import UploadError from './UploadError';
import AudioResultCard from '../../audio/components/AudioResultCard';

const maxSizeMb = 10;

export default function FileUploader() {
  const inputRef = useRef(null);

  const { file, response, loading, error, selectFile, upload, reset } = usePdfUpload();

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
    <section className="uploader-card">
      {!response && (
        <>
          <UploadDropZone
            file={file}
            inputRef={inputRef}
            onInputChange={handleInputChange}
            maxSizeMb={maxSizeMb}
          />
          <UploadActions loading={loading} disabled={loading || !file} onUpload={handleUpload} />
        </>
      )}
      {error && <UploadError message={error} />}
      {response && <AudioResultCard response={response} onReset={handleReset} />}
    </section>
  );
}
