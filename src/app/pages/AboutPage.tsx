export default function AboutPage() {
  return (
    <>
      {/* Developer */}
      <h2>The Developer</h2>
      <div className="section">
        <p>
          True Friends Quiz was created by{" "}
          <strong>
            <a
              href="https://ntamadakis.gr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manolis Ntamadakis
            </a>
          </strong>{" "}
          as a fun party game for friends and family, built on the{" "}
          <a
            href="https://www.airconsole.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            AirConsole
          </a>{" "}
          platform.
        </p>
        <p>
          The idea is simple: gather your friends, use your phones as
          controllers, and find out who really knows who best!
        </p>
      </div>

      {/* AI-Generated Questions */}
      <h2>About the Questions</h2>
      <div className="section">
        <p>
          The questions in this game were generated with the help of{" "}
          <strong>AI</strong>. While we've done our best to make them fun,
          diverse, and interesting across all 7 supported languages,{" "}
          <strong>AI-generated content isn't perfect</strong> — some
          translations may sound unnatural and some questions might not hit
          quite right.
        </p>
        <p>
          That's exactly where <strong>you</strong> come in!
        </p>
      </div>

      {/* Contribute */}
      <h2>Contributions Welcome!</h2>
      <div className="section">
        <p>
          This is an open project and every contribution is welcome. You can
          help by:
        </p>
        <ul>
          <li>
            <strong>Improving translations</strong> — fix awkward phrasing or
            make questions sound more natural in your language
          </li>
          <li>
            <strong>Writing new questions</strong> — suggest fun, creative, or
            deeper questions to add to the pool
          </li>
          <li>
            <strong>Adding new languages</strong> — help us reach even more
            players around the world
          </li>
          <li>
            <strong>Reporting issues</strong> — found a bug or a typo? Let us
            know!
          </li>
        </ul>
      </div>

      <div className="cta-contribute">
        <a
          href="https://github.com/ntamasM/TrueFriendsQuiz"
          target="_blank"
          rel="noopener noreferrer"
        >
          🤝 Contribute on GitHub
        </a>
      </div>

      {/* Support */}
      <h2>Support the Developer</h2>
      <div className="section">
        <p>
          If you enjoy the game and want to support its development, you can buy
          me a coffee or help cover hosting and other costs:
        </p>
      </div>

      <div className="cta-contribute">
        <a
          href="https://ntamadakis.gr/support-me"
          target="_blank"
          rel="noopener noreferrer"
        >
          ☕ Support Me
        </a>
      </div>

      {/* Supported Languages */}
      <h2>Supported Languages</h2>
      <div className="section">
        <p>
          The game currently supports <strong>7 languages</strong>, each with
          200 questions:
        </p>
        <ul>
          <li>🇬🇧 English</li>
          <li>🇩🇪 German (Deutsch)</li>
          <li>🇬🇷 Greek (Ελληνικά)</li>
          <li>🇪🇸 Spanish (Español)</li>
          <li>🇫🇷 French (Français)</li>
          <li>🇹🇷 Turkish (Türkçe)</li>
          <li>🇸🇦 Arabic (العربية)</li>
        </ul>
      </div>
    </>
  );
}
