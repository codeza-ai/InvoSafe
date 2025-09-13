export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex w-full">
            {children}
        </div>
    );
}