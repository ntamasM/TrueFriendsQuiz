interface HeaderProps {
  page: "home" | "about";
  onNavigate: (page: "home" | "about") => void;
}

export default function Header({ page, onNavigate }: HeaderProps) {
  const isAbout = page === "about";

  return (
    <header>
      <nav className="top-nav">
        {isAbout ? (
          <a onClick={() => onNavigate("home")}>&larr; Home</a>
        ) : (
          <a onClick={() => onNavigate("about")}>About</a>
        )}
      </nav>
      <img
        src={`${import.meta.env.BASE_URL}Assets/Logo/Logo.svg`}
        alt="True Friends Quiz"
        className="header-logo"
      />
      <h1>{isAbout ? "About" : "True Friends Quiz"}</h1>
      <p className="tagline">
        {isAbout
          ? "True Friends Quiz"
          : "How well do your friends really know you?"}
      </p>
    </header>
  );
}
