import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

type Page = "home" | "about";

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const hash = window.location.hash.replace("#", "");
    return hash === "about" ? "about" : "home";
  });

  const navigate = (p: Page) => {
    window.location.hash = p === "home" ? "" : p;
    setPage(p);
  };

  return (
    <>
      <Header page={page} onNavigate={navigate} />
      <div className="container">
        {page === "home" ? <HomePage /> : <AboutPage />}
      </div>
      <Footer />
    </>
  );
}
