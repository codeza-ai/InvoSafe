'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAlertActions } from "@/lib/use-alert";
import { FetchedInvoice } from "@/db/types/fetched";
import { decryptPdf, decryptPrimaryInvoiceKey, decryoptSecondaryInvoiceKey } from "@/lib/crypto";
export default function Home() {
    // const router = useRouter();
    const { invoice_id } = useParams();
    const { data: session } = useSession();
    const [senderId, setSenderId] = useState(null)
    const { showError, showSuccess, showWarning } = useAlertActions();
    const [invoiceDetails, setInvoiceDetails] = useState<FetchedInvoice | null>(null);
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
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

        const arrayBuffer = await encryptedBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const header = invoiceDetails?.decryption_header;
        if (!header) {
            showError("Decryption header not found for the invoice.");
            return;
        }  
        const masterKey = sessionStorage.getItem('masterKey');
        if(!masterKey){
            showError("Master key not found in session. Please login again.");
            return;
        }
        const keyAttributes = JSON.parse(localStorage.getItem("keyAttributes") || "{}");
        if (!keyAttributes || Object.keys(keyAttributes).length === 0) {
            showError("Key attributes not found. Please verify your GST number again.");
            return;
        }
        // If the user is sender, use primary key else use secondary key
        if (invoiceDetails?.sender_gstin === gstin) {
            // Decrypt using primary key
            const primaryKey = invoiceDetails?.primary_invoice_key;
            if(!primaryKey){
                showError("Primary invoice key not found.");
                return;
            }
            const invoiceKey = await decryptPrimaryInvoiceKey(primaryKey, masterKey);
            if(!invoiceKey){
                showError("Failed to decrypt invoice key. Please check your master key.");
                return;
            }
                      
            const decryptedFile = await decryptPdf(uint8Array, header,  invoiceKey);
            if(!decryptedFile){
                showError("Failed to decrypt invoice file.");
                return;
            }
            const file = new File([decryptedFile.slice(0)], `${invoice_id}.pdf`, { type: 'application/pdf' });
            if(!file){
                showError("Failed to create file from decrypted data.");
                return;
            }
            setInvoiceFile(file);
            showSuccess("Invoice file decrypted successfully.");
        } else if (invoiceDetails?.recipient_gstin === gstin){
            // Decrypt using secondary key
            const secondaryKey = invoiceDetails?.secondary_invoice_key;
            if(!secondaryKey){
                showError("Secondary invoice key not found.");
                return;
            }
            const recipientPrivateKey = sessionStorage.getItem('secretKey');
            const recipientPublicKey = keyAttributes.publicKey;
            if(!recipientPrivateKey || !recipientPublicKey){
                showError("Recipient keys not found in session. Please login again.");
                return;
            }

            const invoiceKey = await decryoptSecondaryInvoiceKey(secondaryKey, recipientPrivateKey, recipientPublicKey);
            if(!invoiceKey){
                showError("Failed to decrypt invoice key. Please check your keys.");
                return;
            }
            const decryptedFile = await decryptPdf(uint8Array, header,  invoiceKey);
            if(!decryptedFile){
                showError("Failed to decrypt invoice file.");
                return;
            }
            const file = new File([decryptedFile.slice(0)], `${invoice_id}.pdf`, { type: 'application/pdf' });
            if(!file){
                showError("Failed to create file from decrypted data.");
                return;
            }
            setInvoiceFile(file);
            showSuccess("Invoice file decrypted successfully.");
        }else{
            showError("You are not authorized to access the file.");
        }
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