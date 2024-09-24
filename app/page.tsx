
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
// import styles from '@/app/ui/home.module.css';
import Image from 'next/image';
import VyayamLogo from '@/app/ui/vyayam-logo';
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-[#FF6600] p-4 md:h-40">
        <VyayamLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <h1 className={`text-3xl font-bold text-gray-800 md:text-5xl`}>
            Welcome to <br />
            <span className="text-[#FF9955]">Vyayam</span>
          </h1>
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            Invoices Made Easy.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-[#FF6600] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF9955] md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="md:hidden block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
    </main>
  );
}
