import {Metadata} from 'next';
import CustomerForm from '@/app/ui/customers/create-form';

export const metadata: Metadata = {
    title: 'Create customer',
}
export default async function Page() {
    return (
        <main>
        <h1>Create a new customer</h1>
        <CustomerForm/>
        </main>
    );
}