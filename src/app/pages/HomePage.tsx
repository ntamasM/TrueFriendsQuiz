export default function HomePage() {
  return (
    <>
      {/* CTA */}
      <div className="play-section">
        <a
          className="play-btn"
          href="https://www.airconsole.com/#https://true-friends.nt-sites.gr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ▶ Play Now on AirConsole
        </a>
        <p className="note">
          The game is currently under review. Once approved it will be available
          directly on the AirConsole platform.
        </p>
      </div>

      {/* How to play */}
      <h2>How to Play</h2>
      <ol className="steps">
        <li>
          <div>
            <strong>Open the game on a big screen</strong>
            <span>
              Visit the link above on a laptop, desktop, or smart TV browser.
              This will be the shared screen everyone looks at.
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>Connect your phones</strong>
            <span>
              Each player scans the QR code shown on the screen (or goes to{" "}
              <strong>airconsole.com</strong> and enters the on-screen code).
              Your phone becomes your personal controller.
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>Gather at least 3 players</strong>
            <span>
              The quiz needs a minimum of 3 friends to start. The more the
              merrier!
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>Vote on a category &amp; pick a question</strong>
            <span>
              Each round, the host votes on a category group — Fun, Deep,
              Dilemma, or Spicy — then picks a question. For example{" "}
              <em>"What is Alex's biggest fear?"</em>
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>Everyone guesses</strong>
            <span>
              All other players choose the answer they think is correct using
              their phone. The host picks the real answer privately.
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>Score points &amp; win!</strong>
            <span>
              Earn points for correct guesses — and a speed bonus for guessing
              first! Build streaks, send emoji reactions, and compete for the
              crown! 👑
            </span>
          </div>
        </li>
      </ol>

      {/* Features */}
      <h2>Game Features</h2>
      <div className="features">
        <div className="feature-card">
          <div className="icon">🌍</div>
          <strong>7 Languages</strong>
          <span>
            English, German, Greek, Spanish, French, Turkish &amp; Arabic
          </span>
        </div>
        <div className="feature-card">
          <div className="icon">❓</div>
          <strong>420+ Questions</strong>
          <span>
            Per language across 17 categories — from fun to spicy
          </span>
        </div>
        <div className="feature-card">
          <div className="icon">🗳️</div>
          <strong>Category Voting</strong>
          <span>
            The host votes on Fun, Deep, Dilemma, or Spicy each round
          </span>
        </div>
        <div className="feature-card">
          <div className="icon">⚡</div>
          <strong>Speed Bonus &amp; Streaks</strong>
          <span>Guess first for bonus points and build winning streaks</span>
        </div>
        <div className="feature-card">
          <div className="icon">📱</div>
          <strong>Phone as Controller</strong>
          <span>No extra hardware needed — just your smartphones</span>
        </div>
        <div className="feature-card">
          <div className="icon">🎮</div>
          <strong>Powered by AirConsole</strong>
          <span>
            The couch-gaming platform that turns any screen into a console
          </span>
        </div>
      </div>

      {/* What is AirConsole */}
      <h2>What is AirConsole?</h2>
      <p style={{ color: "#ccc", lineHeight: 1.6, marginBottom: "1rem" }}>
        <a
          href="https://www.airconsole.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ffd200" }}
        >
          AirConsole
        </a>{" "}
        is a free online gaming platform where your browser is the console and
        your smartphones are the controllers. No downloads, no installs — just
        open, connect, and play together.
      </p>
    </>
  );
}
