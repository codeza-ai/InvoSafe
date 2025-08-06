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

        // Validation
        if (!receiverGstNumber || !amount || !title || !invoiceNumber || !date) {
            alert("Please fill in all required fields");
            return;
        }
        if (!senderGstNumber) {
            alert("Sender GST number not found. Please log in again.");
            return;
        }
        if (receiverGstNumber === senderGstNumber) {
            alert("Sender and receiver GST numbers cannot be the same");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append("senderGstin", senderGstNumber);
            formData.append("receiverGstin", receiverGstNumber);
            formData.append("amount", amount);
            formData.append("title", title);
            formData.append("invoiceNumber", invoiceNumber);
            formData.append("description", description);
            formData.append("invoiceDate", date.toISOString());

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
                    {/* Form will be hidden until GST number is verified */}
                    {/* <form className={verified ? "block" : "hidden"}> */}
                    <form onSubmit={handleSubmit}>
                        <div className="flex mb-3">
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
                                <Label htmlFor="receiver-gstin">Receiver GST Number</Label>
                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        id="receiver-gstin"
                                        type="text"
                                        required
                                        placeholder="GST Number"
                                        value={receiverGstNumber}
                                        onChange={(e) => setReceiverGstNumber(e.target.value)}
                                    />
                                    {/* <Button type="submit" variant="default">
                                        Verify
                                    </Button> */}
                                </div>
                            </div>

                            {/* <div id="gst-status" className="text-sm text-gray-500">
                            <span></span>
                        </div> */}
                        </div>
                        <div className="flex mb-3">
                            <div className="grid w-1/3 items-center gap-3 mr-3">
                                <Label htmlFor="invoice">Invoice File (Optional)</Label>
                                <Input
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setInvoice(e.target.files[0])
                                        }
                                    }}
                                    id="invoice"
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
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
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    type="text"
                                    required
                                    id="title"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid w-1/2 items-center gap-3">
                                <Label htmlFor="invoice-number">Invoice Number</Label>
                                <Input
                                    type="text"
                                    required
                                    id="invoice-number"
                                    placeholder="Invoice Number"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid w-full gap-3 mb-3">
                            <Label htmlFor="description">Your message</Label>
                            <Textarea
                                placeholder="Description of invoice"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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