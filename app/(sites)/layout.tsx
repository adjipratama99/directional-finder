import Header from "@/components/layouts/navbar";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen p-8 bg-gray-100">
        {children}
      </main>
    </>
  )
}