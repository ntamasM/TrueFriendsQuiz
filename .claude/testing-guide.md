# True Friends Quiz — Testing Guide

This guide explains how to test the True Friends Quiz game locally using the AirConsole Simulator and on real phones.

---

## Prerequisites

You need a **local web server** to serve the game files. Here are a few easy options:

### Option A: Python (simplest)

If you have Python installed:

```bash
# Navigate to the game folder
cd C:\Users\Ntamas\Desktop\Personal\AirConsole\TrueFriendsQuiz

# Python 3
python -m http.server 8080

# Python 2
python -SimpleHTTPServer 8080
```

### Option B: Node.js (http-server)

```bash
# Install globally (one time)
npm install -g http-server

# Navigate to game folder and start
cd C:\Users\Ntamas\Desktop\Personal\AirConsole\TrueFriendsQuiz
http-server -p 8080
```

### Option C: VS Code Live Server Extension

1. Install the **"Live Server"** extension in VS Code.
2. Right-click `screen.html` → **"Open with Live Server"**.
3. Note the port (usually `5500`).

---

## Method 1: AirConsole Simulator (Easiest — No Phone Needed)

The simulator shows the screen + 2 virtual controllers side by side in one browser window.

### Steps

1. **Start your local web server** (see above). Confirm it's running:
   - Open `http://localhost:8080/screen.html` in your browser — you should see the game lobby.
   - Open `http://localhost:8080/controller.html` — you should see the controller UI.

2. **Find your local IP address:**

   ```powershell
   # In PowerShell
   (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike '*Loopback*' -and $_.PrefixOrigin -eq 'Dhcp' }).IPAddress
   ```

   Or simply:

   ```powershell
   ipconfig
   ```

   Look for your **IPv4 Address** (e.g., `192.168.1.42`).

3. **Open the AirConsole Simulator:**

   Since we use `http` (not `https`), use the **HTTP simulator**:

   ```
   http://http.airconsole.com/simulator/#debug:http://YOUR_IP:8080/
   ```

   For example:

   ```
   http://http.airconsole.com/simulator/#debug:http://192.168.1.42:8080/
   ```

   > **IMPORTANT:** Replace `YOUR_IP` with your actual IP. Do NOT use `localhost` or `127.0.0.1` — it won't work for controllers.

4. **The simulator will show:**
   - The **game screen** (large area on the left)
   - **2 virtual controllers** (smaller panels on the right)
   - You can add more virtual controllers with the `+` button in the simulator

5. **Testing the game flow:**
   - The lobby should show 2+ connected players
   - Since you need 3 players minimum, click the `+` button to add a 3rd virtual controller
   - The master controller (first one) will see the "Start Game" button
   - Click "Start Game" to begin

### Simulator Limitations

- The simulator shows 2 controllers by default. You can add more with the `+` button.
- Touch events work as regular clicks in the simulator.

---

## Method 2: Testing on Your Phone (Real Device)

### Prerequisites

- Your computer and phone must be on the **same Wi-Fi network**.
- Your computer's firewall must allow incoming connections on port 8080.

### Steps

1. **Start your local web server** on port 8080.

2. **Find your local IP** (as described above, e.g., `192.168.1.42`).

3. **Verify your phone can reach the server:**
   - On your phone's browser, open: `http://192.168.1.42:8080/screen.html`
   - If you see the game lobby, your connection works!

4. **Open the game on your computer's browser (this is the Screen):**

   ```
   http://http.airconsole.com/#http://192.168.1.42:8080/
   ```

   > **NOTE:** There is NO `screen.html` at the end of this URL. AirConsole appends it automatically.

5. **On your phone, join the game:**
   - Open your phone's browser and go to: `https://www.airconsole.com`
   - You will see a screen asking for a **join code**
   - Enter the code shown in the top-right corner of the game screen on your computer
   - Your phone will load the controller interface

6. **Get more players:**
   - Ask friends on the same network to do step 5
   - Or open additional browser tabs / use other devices
   - You need at least **3 controllers** to start the game

### Troubleshooting: Phone Can't Connect

| Problem                                 | Solution                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Phone can't reach `http://YOUR_IP:8080` | Check that both devices are on the same Wi-Fi. Disable VPN.                                        |
| Windows Firewall blocks the connection  | Allow port 8080 in Windows Firewall (see below).                                                   |
| Controller loads but game doesn't work  | Make sure you're NOT using `localhost` or `127.0.0.1` in the AirConsole URL. Use your real LAN IP. |
| Mixed content (HTTP/HTTPS) error        | Use `http://http.airconsole.com/` (not `https://www.airconsole.com/`).                             |

### Allow Port 8080 Through Windows Firewall

```powershell
# Run PowerShell as Administrator
New-NetFirewallRule -DisplayName "AirConsole Dev Port 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

---

## Method 3: HTTPS Testing with ngrok (For Production-Like Testing)

When your game is uploaded to AirConsole, it runs over HTTPS. Use ngrok to test HTTPS locally.

### Steps

1. **Install ngrok:** Download from [https://ngrok.com](https://ngrok.com) and install.

2. **Start your web server** on port 8080.

3. **Start ngrok:**

   ```bash
   ngrok http 8080
   ```

4. **Copy the HTTPS URL** from ngrok output (e.g., `https://abc123.ngrok.io`).

5. **Open in the HTTPS simulator:**

   ```
   https://www.airconsole.com/simulator/#debug:https://abc123.ngrok.io/
   ```

6. **Join with phone:**
   - Open the game screen at: `https://www.airconsole.com/#https://abc123.ngrok.io/`
   - Enter the join code on your phone at `https://www.airconsole.com`

---

## Quick Reference

| What                       | URL                                                                   |
| -------------------------- | --------------------------------------------------------------------- |
| HTTP Simulator             | `http://http.airconsole.com/simulator/#debug:http://YOUR_IP:8080/`    |
| HTTPS Simulator (ngrok)    | `https://www.airconsole.com/simulator/#debug:https://YOUR_NGROK_URL/` |
| Screen (for phone testing) | `http://http.airconsole.com/#http://YOUR_IP:8080/`                    |
| Phone join                 | `https://www.airconsole.com` → enter the code                         |
| Screen direct test         | `http://YOUR_IP:8080/screen.html`                                     |
| Controller direct test     | `http://YOUR_IP:8080/controller.html`                                 |

---

## Game Testing Checklist

- [ ] Lobby shows connected players with names
- [ ] Language switch (English/Greek) works
- [ ] Start button only appears for master controller
- [ ] Start button disabled with < 3 players
- [ ] Host receives 4 question options on controller
- [ ] Other players see "waiting" while host picks
- [ ] Host answers privately on controller
- [ ] Question + answers appear on screen during guess phase
- [ ] Timer counts down from 20 seconds
- [ ] Player status dots turn green when they answer
- [ ] Reveal screen highlights correct answer
- [ ] Score changes shown correctly (+100 for correct, 0 for wrong)
- [ ] Next round starts with new host
- [ ] Final leaderboard shows podium and rankings
- [ ] Play Again resets and starts new game
- [ ] Back to Menu returns to lobby

---

## File Structure

```
TrueFriendsQuiz/
├── screen.html          ← Game screen (TV/monitor)
├── controller.html      ← Phone controller
├── css/
│   ├── screen.css       ← Screen styles
│   └── controller.css   ← Controller styles
├── js/
│   ├── screen.js        ← All game logic
│   ├── controller.js    ← Controller I/O
│   └── questions.js     ← Question bank + translations
└── .claude/
    ├── game-description.md
    └── testing-guide.md  ← This file
```
