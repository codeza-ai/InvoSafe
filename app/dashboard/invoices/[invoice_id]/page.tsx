'use client';

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAlertActions } from "@/lib/use-alert";
import { FetchedInvoice } from "@/db/types/fetched";

export default function Home() {
    // const router = useRouter();
    const { invoice_id } = useParams();
    const { data: session } = useSession();
    const [senderId, setSenderId] = useState(null)
    const { showError, showSuccess, showWarning } = useAlertActions();
    const [invoiceDetails, setInvoiceDetails] = useState<FetchedInvoice | null>(null);
    const [invoiceFile, setInvoiceFile] = useState(null);
    // const [encryptedFile, setEncryptedFile] = useState<File | null>();
    const [isFetching, setIsFetching] = useState(false);

    const gstin = session?.user?.gstin || "";

    async function fetchEncryptedBlob() {
        if(!senderId)return;

        const data = await fetch(`${process.env.NEXT_STORAGE_URL}/${senderId}/${invoice_id}.enc`);
        const encrypted = await data.blob();
        return encrypted;
        // Convert Blob to File before setting state
        // const file = new File([encrypted], `${invoice_id}.enc`, { type: encrypted.type });
        // setEncryptedFile(file);
    }


    async function decryptInvoiceFile() {
        const encryptedBlob = await fetchEncryptedBlob();
        if(!encryptedBlob)return;

        // If the user is sender, use primary key else use secondary key
    
    }
    async function getInvoiceDetails() {
        // Fetch invoice details from your API
        console.log(invoice_id);
        console.log(gstin);
        const res = await fetch("/api/invoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                invoice_id : invoice_id,
                gstin: gstin,
            })
        });
        const data = await res.json();
        setInvoiceDetails(data);
    }

    useEffect(() => {
        if (!session || !gstin || !invoice_id) return;
        async function fetchInvoiceDetails() {
            await getInvoiceDetails();
        }
        const timeoutId = setTimeout(() => {
            fetchInvoiceDetails();
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [session, gstin, invoice_id]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex">
                <div className="flex min-h-screen">
                    {invoiceFile ? (
                        <embed
                            src={URL.createObjectURL(invoiceFile)}
                            type="application/pdf"
                            width="100%"
                            height="400px"
                        />
                    ) :
                    (
                        <div>
                            <h1>Decrypting invoice file...</h1>
                        </div>
                    )}
                </div>
                <div className="min-w-[400px] min-h-screen">
                    <div>
                        <h1>Invoice actions</h1>
                    </div>
                    <div>
                        <h1>Invoice details</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}