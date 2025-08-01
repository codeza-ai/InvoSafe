import Link from "next/link"
import { FileText } from "lucide-react"
import Logo from "./Logo";

export default function Footer() {
    return (
        < footer className = "flex justify-center bg-foreground text-background border-t border-medium-blue/10 py-12" >
            <div className="container mx-auto w-3/4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Logo light={true} className="text-background" />
                        </div>
                        <p className="text-dark-navy/70">Streamline your B2B invoice management with our cloud-based platform.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-dark-navy mb-4">Product</h3>
                        <ul className="space-y-2 text-dark-navy/70">
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Security
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Integrations
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-dark-navy mb-4">Company</h3>
                        <ul className="space-y-2 text-dark-navy/70">
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-dark-navy mb-4">Support</h3>
                        <ul className="space-y-2 text-dark-navy/70">
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-blue transition-colors">
                                    Status
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-medium-blue/10 mt-8 pt-8 text-center text-dark-navy/70">
                    <p>&copy; 2024 InvoSafe. All rights reserved.</p>
                </div>
            </div>
      </footer >
    );
}