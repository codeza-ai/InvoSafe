"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

export function DateSelect({ date, setDate, setOpen, open }: {
    date: Date | undefined,
    setDate: (date: Date | undefined) => void,
    setOpen: (open: boolean) => void,
    open: boolean
}) {
    return (
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
                        setDate(date);
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
