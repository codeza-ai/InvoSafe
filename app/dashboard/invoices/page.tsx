"use client"
import Link from "next/link"
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Page() {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-2/3">
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
                        <form>
                            <div className="flex flex-col w-full max-w-sm items-baseline gap-2">
                                <Label htmlFor="gstin">GST Number</Label>
                                <div className="flex items-center gap-2 w-full">
                                    <Input id="gstin" type="text" placeholder="GST Number" />
                                    <Button type="submit" variant="outline">
                                        Verify
                                    </Button>
                                </div>
                                <div id="gst-status" className="text-sm text-gray-500">

                                </div>
                            </div>
                            <div>
                                <div className="grid w-full max-w-sm items-center gap-3">
                                    <Label htmlFor="invoice">Invoice File</Label>
                                    <Input id="invoice" type="file" />
                                </div>
                                <div className="flex flex-col gap-3">
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
                                <div className="grid w-full max-w-sm items-center gap-3">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input id="amount" type="number" />
                                </div>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="title">Title</Label>
                                <Input type="text" id="title" placeholder="Title" />
                            </div>
                            <div className="grid w-full gap-3">
                                <Label htmlFor="description">Your message</Label>
                                <Textarea placeholder="Description of invoice" id="description" />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">
                            Genrate Invoice
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}