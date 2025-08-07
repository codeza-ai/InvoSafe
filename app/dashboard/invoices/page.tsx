"use client"
import Link from "next/link"
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function Page() {
    const { data: session } = useSession();

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const [invoice, setInvoice] = useState<File | null>(null)
    const [receiverGstNumber, setReceiverGstNumber] = useState("")
    const [amount, setAmount] = useState("")
    const [title, setTitle] = useState("")
    const [invoiceNumber, setInvoiceNumber] = useState("")
    const [description, setDescription] = useState("")
    const senderGstNumber = session?.user?.gstin || "" // Assuming gstNumber is stored in user object   
    // const [verified, setVerified] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const senderUserId = session?.user?.user_id || "";
        const validationErrors: string[] = [];
        if (!senderGstNumber || !senderUserId) {
            alert("Unauthorized: Please log in to create an invoice.");
            window.location.href = "/login";
            return;
        }

        if (!receiverGstNumber.trim()) {
            validationErrors.push("• Receiver GST Number is required");
        }
        if (!amount.trim()) {
            validationErrors.push("• Amount is required");
        }
        if (!title.trim()) {
            validationErrors.push("• Title is required");
        }
        if (!invoiceNumber.trim()) {
            validationErrors.push("• Invoice Number is required");
        }
        if (!date) {
            validationErrors.push("• Invoice Date is required");
        }
        // GST Number format validation
        const gstRegex = /^[0-9]{1-2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (receiverGstNumber.trim() && !gstRegex.test(receiverGstNumber.trim())) {
            validationErrors.push("• Invalid GST Number format (should be 15 characters: 22AAAAA0000A1Z5)");
        }

        // Amount validation
        const amountValue = parseFloat(amount);
        if (amount.trim() && (isNaN(amountValue) || amountValue <= 0)) {
            validationErrors.push("• Amount must be a positive number");
        }
        
        if (amountValue > 10000000) { // 1 crore limit
            validationErrors.push("• Amount cannot exceed ₹1,00,00,000");
        }
        if (receiverGstNumber.trim() === senderGstNumber) {
            validationErrors.push("• Sender and receiver GST numbers cannot be the same");
        }
        if (title.trim() && title.trim().length > 100) {
            validationErrors.push("• Title cannot exceed 100 characters");
        }

        if (description.trim() && description.trim().length > 500) {
            validationErrors.push("• Description cannot exceed 500 characters");
        }
        if (date && date > new Date()) {
            validationErrors.push("• Invoice date cannot be in the future");
        }

        if (invoice) {
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            
            if (invoice.size > maxFileSize) {
                validationErrors.push("• File size cannot exceed 10MB");
            }
            
            if (!allowedTypes.includes(invoice.type)) {
                validationErrors.push("• Only PDF, JPEG, JPG, and PNG files are allowed");
            }
        }

        // Show validation errors
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors
        setErrors([]);
        setIsSubmitting(true);

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append("senderGstin", senderGstNumber);
            formData.append("receiverGstin", receiverGstNumber.trim());
            formData.append("amount", amount.trim());
            formData.append("title", title.trim());
            formData.append("invoiceNumber", invoiceNumber.trim());
            formData.append("description", description.trim());
            formData.append("invoiceDate", date!.toISOString()); // Safe because we validated date exists
            formData.append("senderUserId", senderUserId);
            
            if (invoice) {
                formData.append("invoiceFile", invoice);
            }

            // Submit to API
            const response = await fetch("/api/invoice/create", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("Invoice created successfully!");
                // Reset form
                setReceiverGstNumber("");
                setAmount("");
                setTitle("");
                setInvoiceNumber("");
                setDescription("");
                setDate(undefined);
                setInvoice(null);
                // Optionally redirect to invoices list
                // window.location.href = "/dashboard/invoices/sent";
            } else {
                alert(`Error: ${result.error || "Failed to create invoice"}`);
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("An error occurred while creating the invoice");
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
                    {/* Error Display */}
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

                    {/* Form will be hidden until GST number is verified */}
                    {/* <form className={verified ? "block" : "hidden"}> */}
                    <form onSubmit={handleSubmit}>
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
                                        id="receiver-gstin"
                                        type="text"
                                        required
                                        placeholder="22AAAAA0000A1Z5"
                                        value={receiverGstNumber}
                                        onChange={(e) => setReceiverGstNumber(e.target.value.toUpperCase())}
                                        className={receiverGstNumber.length > 0 && receiverGstNumber.length !== 15 ? "border-red-500" : ""}
                                        maxLength={15}
                                    />
                                </div>
                                <div className="text-xs text-gray-500">
                                    {receiverGstNumber.length}/15 characters
                                </div>
                            </div>
                        </div>
                        <div className="flex mb-3">
                            <div className="grid w-1/3 items-center gap-3 mr-3">
                                <Label htmlFor="invoice">Invoice File</Label>
                                <Input
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setInvoice(e.target.files[0])
                                        }
                                    }}
                                    id="invoice"
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    required
                                />
                            </div>
                            <div className="grid w-1/3 items-center gap-3 mr-3">
                                <Label htmlFor="date" className="px-1">
                                    Date of Invoice
                                </Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {date ? date.toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date)
                                                setOpen(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
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
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Creating Invoice..." : "Generate Invoice"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}