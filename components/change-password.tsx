"use client";

import { UPDATE_PASSWORD } from "@/constant/app";
import { useCustomMutation } from "@/hooks/useQueryData";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Modal } from "./custom/modal";
import Link from "next/link";
import { FaAsterisk, FaExclamationCircle, FaEye, FaEyeSlash, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { Label } from "./custom/form/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function ChangePassword(): React.JSX.Element {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title="Change Password"
            trigger={
                <Link href="#" className="flex items-center gap-2"><FaAsterisk /> Change Password</Link>
            }
            content={<ContentChangePassword onClose={setOpen} />}
        />
    )
}

function ContentChangePassword ({ onClose }: { onClose: React.Dispatch<React.SetStateAction<boolean>> }): React.JSX.Element {
    const { data: session } = useSession()
    const [oldPassword, setOldPassword] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<{ oldPassword: boolean; password: boolean; confirmPassword: boolean }>({ oldPassword: false, password: false, confirmPassword: false })

    const id = session?.user.id as string

    const { mutate, isPending } = useCustomMutation({
        mutationKey: [UPDATE_PASSWORD, id, password],
        params: {
            id: parseInt(id),
            password,
            oldPassword
        },
        url: "/api/user?type=update",
        callbackResult: (res) => {
            if(res.content) {
                onClose(false);
            }

            return res;
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(confirmPassword !== password) {
            toast.warning("Password baru dan konfirmasi password tidak sama.")
            return
        }

        mutate({})
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mb-4">
                <Label value="Password Lama" isRequired />
                <div className="relative">
                    <Input
                        type={showPassword.oldPassword ? "text" : "password"}
                        placeholder="Masukkan password lama ..."
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        value={oldPassword}
                    />
                    <div className="absolute right-2.5 top-2 cursor-pointer" onClick={() => setShowPassword(prev => ({...prev, oldPassword: !prev.oldPassword}))}>
                        {
                            showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-4">
                <Label value="Password Baru" isRequired />
                <div className="relative">
                    <Input
                        type={showPassword.password ? "text" : "password"}
                        placeholder="Masukkan password baru ..."
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        value={password}
                    />
                    <div className="absolute right-2.5 top-2 cursor-pointer" onClick={() => setShowPassword(prev => ({...prev, password: !prev.password}))}>
                        {
                            showPassword.password ? <FaEyeSlash /> : <FaEye />
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-4">
                <Label value="Konfirmasi Password" isRequired />
                <div className="relative">
                    <Input
                        type={showPassword.confirmPassword ? "text" : "password"}
                        placeholder="Masukkan ulang password baru ..."
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        value={confirmPassword}
                    />
                    <div className="absolute right-2.5 top-2 cursor-pointer" onClick={() => setShowPassword(prev => ({...prev, confirmPassword: !prev.confirmPassword}))}>
                        {
                            showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />
                        }
                    </div>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>{
                isPending ? <><FaSpinner className="animate-spin" />Processing ...</> : <><FaPaperPlane />Submit</> 
            }</Button>
        </form>
    )
}