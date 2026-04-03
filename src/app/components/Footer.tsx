export default function Footer() {
  return (
    <footer>
      <img
        src={`${import.meta.env.BASE_URL}Assets/Logo/Logo.svg`}
        alt="True Friends Quiz"
        className="footer-logo"
      />
      <div className="footer-text">
        True Friends Quiz &copy; {new Date().getFullYear()} &middot; Built with
        ❤️ for{" "}
        <a
          href="https://www.airconsole.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          AirConsole
        </a>{" "}
        by{" "}
        <a
          href="https://ntamadakis.gr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manolis Ntamadakis
        </a>
      </div>
    </footer>
  );
}
