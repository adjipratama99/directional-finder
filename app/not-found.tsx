import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaExclamationTriangle } from "react-icons/fa"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <FaExclamationTriangle className="w-16 h-16 text-red-500 mb-6" />
            <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-muted-foreground mb-6">
                Halaman yang kamu cari tidak ditemukan atau telah dipindahkan.
            </p>
            <Link href="/dashboard">
                <Button variant="default">Kembali ke Dashboard</Button>
            </Link>
        </div>
    )
}
