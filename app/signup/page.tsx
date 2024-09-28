import VyayamLogo from '@/app/ui/vyayam-logo';
import SignupForm from '@/app/ui/signup-form';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Sign Up',
};

export default function LoginPage() {
    return (
        <main className="flex items-center justify-around md:h-screen p-2">
            <div className="relative mt-10 mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-10">
                <div className="flex h-18 w-full items-end rounded-lg bg-[#FF6600] p-3 md:h-30">
                    <Link href='/' className="w-32 text-white md:w-36">
                        <VyayamLogo />
                    </Link>
                </div>
                <SignupForm />
            </div>
        </main>
    );
}
