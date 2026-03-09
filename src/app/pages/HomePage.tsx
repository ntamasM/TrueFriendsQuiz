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
            <strong>Pick a question</strong>
            <span>
              Each round, a question is shown about one player — for example{" "}
              <em>"What is Alex's biggest fear?"</em>
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>Everyone answers</strong>
            <span>
              All other players choose the answer they think is correct using
              their phone. The player the question is about picks the real
              answer.
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>Score points &amp; win!</strong>
            <span>
              You earn points for every correct guess. At the end, the player
              who knows the group best wins the crown! 👑
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
          <strong>200 Questions</strong>
          <span>
            Per language — from fun favourites to deep personal questions
          </span>
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
