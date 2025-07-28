"use client"

import { Label } from "@/components/custom/form/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FaExclamation, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa'
import { toast } from "sonner";
import { signIn } from 'next-auth/react'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const redirectUrl = useMemo(() => searchParams.get('callbackUrl'), [searchParams])

  const handleSubmit = async () => {
    setLoading(true)
    const value = { username, password }
    const response = await signIn("signin", {
        ...value,
        redirect: false
    })

    if (response?.error) {
        setLoading(false)
        const error = response?.error === "CredentialsSignin" ? "Username atau password salah" : response?.error;
        toast(error, {
            position: 'top-center',
            icon: <FaExclamation color="red" />
        })
    }

    if (response?.status === 200 && !response?.error) {
        setLoading(false)
        toast.success('Successfuly login!', {
            position: 'top-center'
        })

        router.push(redirectUrl ? redirectUrl : '/dashboard')
    }
  }

  return (
    <div className={cn(
      "flex justify-center items-center h-screen bg-neutral-200"
    )}>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl">Selamat datang</CardTitle>
          <CardDescription>Masukkan username dan password dibawah ini untuk login.</CardDescription>
          <CardContent className="px-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <Label value="Username" isRequired />
                  <Input
                      type="text"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username ..."
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Label value="Password" isRequired />
                    <div className="relative w-full cursor-pointer">
                      <Input
                          type={showPassword ? "text" : "password"}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan password ..."
                        />
                        <div className="absolute top-2.5 right-2.5" onClick={() => setShowPassword(prev => !prev)}>
                          {
                            !showPassword ? <FaEyeSlash /> : <FaEye />
                          }
                        </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                    >
                      {
                        isLoading ?
                        <>
                          <FaSpinner className="animate-spin" />
                          Processing ...
                        </>
                        : "Log-In"
                      }
                    </Button>
                  </div>
              </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
