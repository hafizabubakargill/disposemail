import SecureNotesViewer from '@/components/SecureNotesViewer';

// Next.js dynamic route params
export default async function SecureNoteViewerPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    // Await params as required by Next.js 15
    const { id } = await params;

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
             <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
                <SecureNotesViewer noteId={id} />
             </div>
        </div>
    );
}
