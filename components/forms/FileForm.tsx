import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { set } from "zod";
export function FileForm(
    {setInvoice, name}:
    { setInvoice: (file: File) => void,
        name?: string 
    }
) {
    const [file, setFile]  = useState<File | null>(null)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                onClick={()=>setFile(null)}
                variant="outline">{name}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select invoice file</DialogTitle>
                    <DialogDescription>
                        Preferably PDF format.(.pdf,.png,.jpg,.jpeg)
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setFile(e.target.files[0])
                                }
                            }}
                            id="invoice"
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            required
                        />
                    </div>
                    {file && (
                        <div>
                            {file.type === "application/pdf" ? (
                                <embed
                                    src={URL.createObjectURL(file)}
                                    type="application/pdf"
                                    width="100%"
                                    height="400px"
                                />
                            ) : (
                                <img
                                    className="rounded-md"
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    style={{ maxWidth: "100%", maxHeight: 400 }}
                                />
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button
                        onClick={() => {
                            if (file) {
                                setInvoice(file)
                            }
                            setFile(null)

                        }}
                        disabled={!file}
                    >Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
