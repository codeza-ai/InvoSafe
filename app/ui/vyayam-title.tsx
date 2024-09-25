import { lusitana } from '@/app/ui/fonts';

export default function VyayamTitle() {
    return (
        <div
            className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
        >
            <p className="text-[44px]">Vyayam</p>
        </div>
    );
}