import Navbar from "./Navbar";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-app-background">
      <Navbar />

      <main className="min-h-screen pb-16 md:pl-60 md:pb-0">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;