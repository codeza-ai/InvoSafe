"use client"
import Link from "next/link";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAlertActions } from "@/lib/use-alert";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { FileForm } from "@/components/forms/FileForm";
import { DateSelect } from "@/components/ui/DateSelect";
import { validateInvoiceForm } from "@/lib/invoice-validation";
import { encryptPdf, getEncryptedInvoiceKeys }from "@/lib/crypto";
export function InvoiceForm() {
    const { data: session } = useSession();
    const { showError, showSuccess, showWarning } = useAlertActions();
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [invoice, setInvoice] = useState<File | null>(null);
    const [receiverGstNumber, setReceiverGstNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [title, setTitle] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [description, setDescription] = useState("");
    const [recipientVerified, setRecipientVerified] = useState(false);

    const senderGstNumber = session?.user?.gstin || "";
    const senderUserName = session?.user?.business_name || "";

    const verifyRecipient = async(receiverGstin : string)=>{
        // GST Number format validation
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[0-9A-Z]{4}$/;
        if (receiverGstin.trim() && !gstRegex.test(receiverGstin.trim())) {
            setErrors([
                "• Invalid GST Number format (should be 15 characters: 02AAAAA0000A1Z5)"
            ]);
            return;
        }
        try {
            const response = await fetch("/api/user/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gstin: receiverGstin }),
            });
            const result = await response.json();
            if (response.ok) {
                setRecipientVerified(true);
                sessionStorage.setItem("recipientInfo", JSON.stringify(result.recipient));
                showSuccess("Receiver GSTIN verified successfully!");
            } else {
                showError(result.error || "Failed to verify receiver GSTIN");
            }
        }catch(error){
            console.error("Error verifying GSTIN:", error);
            showError("An error occurred while verifying the GSTIN");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!recipientVerified){
            setErrors(["Please verify the receiver GSTIN before submitting the form."]);
        }
        const validationErrors = validateInvoiceForm({
            senderGstNumber,
            senderUserName,
            receiverGstNumber,
            amount,
            title,
            invoiceNumber,
            description,
            date,
            invoice
        });
        if (!senderGstNumber || !senderUserName) {
            showWarning("Unauthorized: Please log in to create an invoice.");
            window.location.href = "/login";
            return;
        }
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors([]);
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("senderGstin", senderGstNumber);
            formData.append("receiverGstin", receiverGstNumber.trim());
            formData.append("amount", amount.trim());
            formData.append("title", title.trim());
            formData.append("invoiceNumber", invoiceNumber.trim());
            formData.append("description", description.trim());
            formData.append("invoiceDate", date!.toISOString());
            formData.append("senderUserName", senderUserName);
            
            if (invoice) {
                const pdfBytes = new Uint8Array(await invoice.arrayBuffer());
                const {encryptedData,decryptionHeader,invoiceKey} = await encryptPdf(pdfBytes);

                // Fix: Ensure encryptedData is a valid BlobPart by slicing its ArrayBuffer
                const encryptedFile = new File([encryptedData.slice(0)], invoice.name + ".enc", { type: "application/octet-stream" });
                const recipientInfo = sessionStorage.getItem("recipientInfo");

                if (!recipientInfo) {
                    showError("Recipient information not found. Please verify the receiver GSTIN again.");
                    setIsSubmitting(false);
                    return;
                }

                const { publicKey: recipientPublicKey } = JSON.parse(recipientInfo);
                const masterKey = sessionStorage.getItem("encryptionKey");
                if (!masterKey) {
                    showError("Master key not found. Please log in again.");
                    setIsSubmitting(false);
                    return;
                }
                console.log("Encrypting invoice keys for recipient...");
                console.log("invoiceKey:", invoiceKey);
                console.log("masterKey:", masterKey);
                console.log("recipientPublicKey:", recipientPublicKey);

                if (!invoiceKey || !masterKey || !recipientPublicKey) {
                    showError("Encryption keys missing or invalid. Please verify and try again.");
                    setIsSubmitting(false);
                    return;
                }
                const {
                    primaryInvoiceKey,
                    secondaryInvoiceKey
                } = await getEncryptedInvoiceKeys(invoiceKey, masterKey, recipientPublicKey);
                console.log("Encrypted invoice keys generated.");
                formData.append("decryptionHeader", decryptionHeader);
                formData.append("primaryInvoiceKey", primaryInvoiceKey);
                formData.append("secondaryInvoiceKey", secondaryInvoiceKey);
                formData.append("invoiceFile", encryptedFile);
                // formData.append("invoiceFile", invoice);
            }
            console.log("Submitting invoice creation form...");
            const response = await fetch("/api/invoice/create", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                showSuccess("Invoice created successfully!");
                setReceiverGstNumber("");
                setAmount("");
                setTitle("");
                setInvoiceNumber("");
                setDescription("");
                setDate(undefined);
                setInvoice(null);
                setErrors([]);
            } else {
                showError(result.error || "Failed to create invoice");
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            showError("An error occurred while creating the invoice");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center w-1/2 max-w-3xl min-w-2xl">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Generate Invoice</CardTitle>
                    <CardDescription>
                        First enter GST number to and click verify, then fill out the invoice details.
                    </CardDescription>
                    <CardAction>
                        <Link href="/dashboard/users/find_user"><Button variant="outline">Search GSTIN</Button></Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {errors.length > 0 && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
                            <ul className="text-red-700 text-sm space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                        <div className="flex mb-3 items-baseline">
                            <div className="grid w-1/2 items-center gap-3 pr-3">
                                <Label htmlFor="gstin">Sender GST Number</Label>
                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        value={senderGstNumber}
                                        readOnly
                                        id="gstin" type="text" placeholder="GST Number" />
                                </div>
                            </div>
                            <div className="grid w-1/2 items-center gap-3">
                                <Label htmlFor="receiver-gstin">Receiver GST Number * (15 chars)</Label>
                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        readOnly={recipientVerified}
                                        id="receiver-gstin"
                                        type="text"
                                        required
                                        placeholder="Eg. 22AAAAA0000A1Z5"
                                        value={receiverGstNumber}
                                        onChange={(e) => setReceiverGstNumber(e.target.value.toUpperCase())}
                                        className={receiverGstNumber.length > 0 && receiverGstNumber.length !== 15 ? "border-red-500" : ""}
                                        maxLength={15}
                                    />
                                    <Button
                                        variant={"default"}
                                        disabled={receiverGstNumber.length !== 15 || recipientVerified}
                                        onClick={async() => await verifyRecipient(receiverGstNumber)}
                                    >Verify</Button>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {receiverGstNumber.length}/15 characters
                                </div>
                            </div>
                        </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex mb-3">
                            <div className="grid w-1/3 items-center gap-3 mr-3">
                                <Label htmlFor="invoice">Invoice File</Label>
                                <FileForm 
                                name = {invoice ? invoice.name : "Select file"}
                                setInvoice={setInvoice} />
                            </div>
                            <div className="grid w-1/3 items-center gap-3 mr-3">
                                <Label htmlFor="date" className="px-1">
                                    Date of Invoice
                                </Label>
                                <DateSelect
                                    date={date}
                                    setDate={setDate}
                                    setOpen={setOpen}
                                    open={open}
                                />
                            </div>
                            <div className="grid w-1/3 items-center gap-3">
                                <Label htmlFor="amount">Amount (INR) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    placeholder="Enter amount in INR"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex mb-3">
                            <div className="grid w-1/2 items-center gap-3 pr-3">
                                <Label htmlFor="title">Title * (max 100 chars)</Label>
                                <Input
                                    type="text"
                                    required
                                    id="title"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={title.length > 100 ? "border-red-500" : ""}
                                />
                                <div className="text-xs text-gray-500">
                                    {title.length}/100 characters
                                </div>
                            </div>
                            <div className="grid w-1/2 items-center gap-3">
                                <Label htmlFor="invoice-number">Invoice Number * (max 50 chars)</Label>
                                <Input
                                    type="text"
                                    required
                                    id="invoice-number"
                                    placeholder="Invoice Number"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className={invoiceNumber.length > 50 ? "border-red-500" : ""}
                                />
                                <div className="text-xs text-gray-500">
                                    {invoiceNumber.length}/50 characters
                                </div>
                            </div>
                        </div>
                        <div className="grid w-full gap-3 mb-3">
                            <Label htmlFor="description">Description (Optional - max 500 chars)</Label>
                            <Textarea
                                placeholder="Description of invoice"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={description.length > 500 ? "border-red-500" : ""}
                            />
                            <div className="text-xs text-gray-500">
                                {description.length}/500 characters
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !recipientVerified}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Creating Invoice..." : "Generate Invoice"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
