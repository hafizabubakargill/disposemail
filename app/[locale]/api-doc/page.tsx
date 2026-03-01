import { redirect } from 'next/navigation';

export default function ApiDocRedirect({ params }: { params: { locale: string } }) {
    redirect(`/${params.locale}/api-docs`);
}
