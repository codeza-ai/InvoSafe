import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    className?: string;
    light?: boolean;
}

export default function Logo({ className, light = false}: LogoProps) {
    return (
        <div className={className}>
            <Link href="/" className="flex items-center h-fit px-4">
                <Image
                    src={light ? "/Logo-light.svg" : "/Logo.svg"}
                    alt="InvoSafe"
                    width={50}
                    height={50}
                />
                <span className="ml-2 text-3xl font-bold">InvoSafe</span>
            </Link>
        </div>
    )
}