import SecureNotesViewer from '@/components/SecureNotesViewer';

// Next.js dynamic route params
export default async function SecureNoteViewerPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    // Await params as required by Next.js 15
    const { id } = await params;

    return (
        <div className="min-h-screen bg-black relative flex flex-col pt-24 pb-20 items-center overflow-x-hidden pt-32">
             <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
             
             <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col mt-8 lg:mt-12">
                <SecureNotesViewer noteId={id} />
             </div>
        </div>
    );
}
