import Header from "@/components/layouts/navbar";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main className="h-[94vh] p-8 bg-gray-100">
        {children}
      </main>
    </>
  )
}