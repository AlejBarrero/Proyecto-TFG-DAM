import FileUploader from '../features/upload/components/FileUploader';
import UserDocumentEditor from '../features/user/components/UserDocumentEditor';
import UserDocumentsList from '../features/user/components/UserDocumentsList';
import { useUserDocumentsDashboard } from '../features/user/hooks/useUserDocumentsDashboard';
import MarketingHero from '../shared/components/MarketingHero';
import TopNavbar from '../shared/components/TopNavbar';

function UserDocumentsPage({ user, onSignOut }) {
  const {
    documents,
    selectedDocument,
    editableDocument,
    audioUrl,
    loadingList,
    loadingDetail,
    saving,
    error,
    loadDocuments,
    handleSelectDocument,
    handleFieldChange,
    handleSave,
    handleDelete,
  } = useUserDocumentsDashboard();

  return (
    <div className="min-h-screen bg-slate-100 text-brand-dark">
      <TopNavbar isAuthenticated onSignOut={onSignOut} />
      <MarketingHero
        eyebrow="Usuario"
        title="Convierte documentos PDF en audio con una experiencia dual."
        description="Los invitados pueden convertir temporalmente. Los usuarios autenticados guardan sus documentos, y los administradores acceden a una vista de control global."
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <section className="rounded-[28px] bg-white p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-mid">
            Sesion activa
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-brand-dark">
                Tu espacio personal de documentos
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Crea, revisa y edita tus documentos desde un unico panel.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <strong className="text-brand-dark">{user.userName}</strong> ({user.role})
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-mid">
              Nuevo documento
            </p>
            <h2 className="text-2xl font-black tracking-tight text-brand-dark sm:text-3xl">
              Procesa y guarda un PDF en tu cuenta
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
              Puedes anadir metadatos antes de convertir el documento. El archivo quedara asociado
              a tu usuario y podras revisarlo despues desde este mismo panel.
            </p>
          </div>

          <FileUploader isAuthenticated onUploadSuccess={loadDocuments} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <UserDocumentsList
            documents={documents}
            loading={loadingList}
            selectedDocumentId={selectedDocument?.id}
            onSelectDocument={handleSelectDocument}
          />

          <UserDocumentEditor
            selectedDocument={selectedDocument}
            editableDocument={editableDocument}
            audioUrl={audioUrl}
            loadingDetail={loadingDetail}
            saving={saving}
            error={error}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default UserDocumentsPage;
