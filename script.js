// ========================
// COMPLETE A-TO-Z FIFA 2026 WORLD CUP MATCH DATABASE
// ========================
const allMatches = [
  { id: 1, teamA: "Argentina", teamB: "Nigeria", datetime: "2026-06-11T13:00:00", stage: "Group A", venue: "Los Angeles" },
  { id: 2, teamA: "Germany", teamB: "Mexico", datetime: "2026-06-11T19:00:00", stage: "Group A", venue: "Mexico City" },
  { id: 3, teamA: "Brazil", teamB: "Japan", datetime: "2026-06-12T15:30:00", stage: "Group B", venue: "Miami" },
  { id: 4, teamA: "France", teamB: "Senegal", datetime: "2026-06-12T21:00:00", stage: "Group B", venue: "Vancouver" },
  { id: 5, teamA: "England", teamB: "USA", datetime: "2026-06-13T16:00:00", stage: "Group C", venue: "Seattle" },
  { id: 6, teamA: "Spain", teamB: "Morocco", datetime: "2026-06-13T20:00:00", stage: "Group C", venue: "San Francisco" },
  { id: 7, teamA: "Netherlands", teamB: "Australia", datetime: "2026-06-14T12:30:00", stage: "Group D", venue: "Dallas" },
  { id: 8, teamA: "Portugal", teamB: "South Korea", datetime: "2026-06-14T18:00:00", stage: "Group D", venue: "Atlanta" },
  { id: 9, teamA: "Belgium", teamB: "Canada", datetime: "2026-06-15T14:00:00", stage: "Group E", venue: "Toronto" },
  { id: 10, teamA: "Croatia", teamB: "Saudi Arabia", datetime: "2026-06-15T22:00:00", stage: "Group E", venue: "Houston" },
  { id: 11, teamA: "Uruguay", teamB: "Ghana", datetime: "2026-06-16T17:00:00", stage: "Group F", venue: "Kansas City" },
  { id: 12, teamA: "Switzerland", teamB: "Ecuador", datetime: "2026-06-16T19:30:00", stage: "Group F", venue: "Boston" },
  { id: 13, teamA: "Colombia", teamB: "Poland", datetime: "2026-06-17T13:00:00", stage: "Group G", venue: "New York" },
  { id: 14, teamA: "Denmark", teamB: "Tunisia", datetime: "2026-06-17T20:00:00", stage: "Group G", venue: "Philadelphia" },
  { id: 15, teamA: "Serbia", teamB: "Cameroon", datetime: "2026-06-18T16:00:00", stage: "Group H", venue: "Chicago" },
  { id: 16, teamA: "Sweden", teamB: "Iran", datetime: "2026-06-18T23:00:00", stage: "Group H", venue: "Denver" },
  { id: 17, teamA: "Round of 16", teamB: "Match 1A vs 2B", datetime: "2026-06-29T15:00:00", stage: "Knockout R16", venue: "Los Angeles" },
  { id: 18, teamA: "Round of 16", teamB: "Match 1C vs 2D", datetime: "2026-06-30T18:00:00", stage: "Knockout R16", venue: "Vancouver" },
  { id: 19, teamA: "Quarterfinal", teamB: "Winner R16-1", datetime: "2026-07-04T16:00:00", stage: "Quarterfinal", venue: "Miami" },
  { id: 20, teamA: "Quarterfinal", teamB: "Winner R16-2", datetime: "2026-07-05T20:00:00", stage: "Quarterfinal", venue: "Mexico City" },
  { id: 21, teamA: "Semifinal", teamB: "Match QF1 Winner", datetime: "2026-07-09T19:00:00", stage: "Semifinal", venue: "Dallas" },
  { id: 22, teamA: "Semifinal", teamB: "Match QF2 Winner", datetime: "2026-07-10T19:00:00", stage: "Semifinal", venue: "Atlanta" },
  { id: 23, teamA: "FIFA FINAL", teamB: "TBD vs TBD", datetime: "2026-07-19T18:00:00", stage: "FINAL", venue: "New York (MetLife)" }
];

// Load / Save to LocalStorage with Date persistence
let matchesDatabase = [];
const storedData = localStorage.getItem("fifa2026_full_az");
if (storedData) {
  matchesDatabase = JSON.parse(storedData);
  matchesDatabase.forEach(m => { m.datetimeObj = new Date(m.datetime); });
} else {
  matchesDatabase = allMatches.map(m => ({ ...m, datetimeObj: new Date(m.datetime) }));
  localStorage.setItem("fifa2026_full_az", JSON.stringify(matchesDatabase.map(({ datetimeObj, ...rest }) => rest)));
}

// Helper: Update live status based on current time
function updateLiveFlags() {
  const now = new Date();
  matchesDatabase.forEach(match => {
    const matchTime = new Date(match.datetime);
    const diffMinutes = (matchTime - now) / (1000 * 60);
    const isLiveNow = (diffMinutes <= 90 && diffMinutes >= -120);
    match.isLive = isLiveNow;
    if (diffMinutes < -120) match.isLive = false;
  });
  const toStore = matchesDatabase.map(({ datetimeObj, ...rest }) => rest);
  localStorage.setItem("fifa2026_full_az", JSON.stringify(toStore));
}

// Sort by datetime
function sortMatchesByDate() {
  matchesDatabase.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
}

// DOM elements
const container = document.getElementById("matchesAZContainer");
const liveMatchTitleSpan = document.getElementById("liveMatchTitleDisplay");
const simulatedEventDiv = document.getElementById("simulatedEventText");
const scoreSimulateSpan = document.getElementById("scoreSimulate");
const fifaPlayerDiv = document.getElementById("fifaLivePlayer");

let currentActiveMatch = null;

// Dynamic FIFA branded stream simulation
function updateFIFABroadcast(match) {
  if (!match) return;
  liveMatchTitleSpan.innerText = `${match.teamA} 🆚 ${match.teamB} • ${match.stage} • ${match.venue}`;
  const matchDateFormatted = new Date(match.datetime).toLocaleString();
  
  simulatedEventDiv.innerHTML = `🏟️ FIFA WORLD CUP 2026 • ${match.teamA} vs ${match.teamB}<br>📍 ${match.venue}  |  ${matchDateFormatted}  |  ${match.isLive ? "🔴 LIVE NOW" : "📅 SCHEDULED"}`;
  
  if (match.isLive) {
    scoreSimulateSpan.innerHTML = `⚽ LIVE ACTION • FIRST HALF • FIFA OFFICIAL FEED ⚽`;
    const randomScore = () => {
      const fakeScore = `${Math.floor(Math.random() * 3)} - ${Math.floor(Math.random() * 2)}`;
      if (match.isLive && document.getElementById("scoreSimulate")) {
        scoreSimulateSpan.innerHTML = `🏆 LIVE SCORE • ${match.teamA} ${fakeScore.split('-')[0]} - ${fakeScore.split('-')[1]} ${match.teamB} •  ${Math.floor(Math.random() * 30)}'`;
      }
    };
    if (window.scoreInterval) clearInterval(window.scoreInterval);
    window.scoreInterval = setInterval(randomScore, 7500);
    randomScore();
  } else {
    if (window.scoreInterval) clearInterval(window.scoreInterval);
    scoreSimulateSpan.innerHTML = `⏱️ MATCH NOT STARTED • COUNTDOWN TO KICKOFF ⏱️`;
  }
  fifaPlayerDiv.style.background = match.isLive ? "linear-gradient(125deg, #00261e, #0a332a)" : "linear-gradient(125deg, #001e1a, #020f0c)";
}

function setLiveMatch(matchId) {
  const match = matchesDatabase.find(m => m.id === matchId);
  if (match) {
    currentActiveMatch = match;
    updateFIFABroadcast(match);
    renderAllMatchCards();
  } else {
    console.warn("Match not found");
  }
}

// Render FULL A to Z matches
function renderAllMatchCards() {
  sortMatchesByDate();
  container.innerHTML = "";
  matchesDatabase.forEach(match => {
    const matchDateObj = new Date(match.datetime);
    const formattedDateTime = matchDateObj.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    const isCurrentlyLive = match.isLive === true;
    const card = document.createElement('div');
    card.className = "match-card-fifa";
    card.style.border = (currentActiveMatch && currentActiveMatch.id === match.id) ? "2px solid #ffd966" : "";
    card.innerHTML = `
      <div class="match-date">📅 ${formattedDateTime} | ${match.stage} | ${match.venue}</div>
      <div class="match-teams">
        <span>${match.teamA}</span>
        <span class="vs-badge">VS</span>
        <span>${match.teamB}</span>
        ${isCurrentlyLive ? '<span class="live-now-badge">🔴 LIVE</span>' : ''}
      </div>
      <div style="font-size:0.75rem; margin: 5px 0;">⚡ FIFA World Cup 2026 Official Broadcast</div>
      <button class="watch-live-btn" data-id="${match.id}">🎥 WATCH LIVE STREAM (FIFA TV)</button>
    `;
    const watchBtn = card.querySelector('.watch-live-btn');
    watchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setLiveMatch(match.id);
    });
    container.appendChild(card);
  });
}

function autoSelectFirstLiveMatch() {
  updateLiveFlags();
  const liveMatches = matchesDatabase.filter(m => m.isLive === true);
  if (liveMatches.length > 0) {
    setLiveMatch(liveMatches[0].id);
  } else {
    const now = new Date();
    const futureMatches = matchesDatabase.filter(m => new Date(m.datetime) > now).sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
    if (futureMatches.length) setLiveMatch(futureMatches[0].id);
    else setLiveMatch(matchesDatabase[0].id);
  }
  renderAllMatchCards();
}

// Refresh Button Event
document.getElementById("refreshStreamBtn").addEventListener("click", () => {
  if (currentActiveMatch) {
    updateFIFABroadcast(currentActiveMatch);
    const toastMsg = document.createElement('div');
    toastMsg.innerText = "FIFA BROADCAST REFRESHED • SIGNAL STABLE";
    toastMsg.style.position = "fixed";
    toastMsg.style.bottom = "20px";
    toastMsg.style.left = "20px";
    toastMsg.style.background = "#d4af37";
    toastMsg.style.color = "#001e1a";
    toastMsg.style.padding = "8px 16px";
    toastMsg.style.borderRadius = "30px";
    toastMsg.style.fontWeight = "bold";
    toastMsg.style.zIndex = "999";
    document.body.appendChild(toastMsg);
    setTimeout(() => toastMsg.remove(), 2000);
  } else {
    autoSelectFirstLiveMatch();
  }
});

// Full screen Event
document.getElementById("fullScreenMatchBtn").addEventListener("click", () => {
  const playerElem = document.querySelector(".live-broadcast");
  if (playerElem.requestFullscreen) playerElem.requestFullscreen();
  else if (playerElem.webkitRequestFullscreen) playerElem.webkitRequestFullscreen();
});

// Auto-update system interval
setInterval(() => {
  updateLiveFlags();
  sortMatchesByDate();
  const anyLiveNow = matchesDatabase.filter(m => m.isLive === true);
  if (anyLiveNow.length > 0) {
    if (!currentActiveMatch || !currentActiveMatch.isLive) {
      setLiveMatch(anyLiveNow[0].id);
    } else {
      if (currentActiveMatch && currentActiveMatch.isLive) {
        updateFIFABroadcast(currentActiveMatch);
      } else if (currentActiveMatch && !currentActiveMatch.isLive && anyLiveNow.length) {
        setLiveMatch(anyLiveNow[0].id);
      }
    }
  }
  renderAllMatchCards();
  const toStore = matchesDatabase.map(({ datetimeObj, ...rest }) => rest);
  localStorage.setItem("fifa2026_full_az", JSON.stringify(toStore));
}, 30000);

// Initialize Page
updateLiveFlags();
sortMatchesByDate();
autoSelectFirstLiveMatch();

window.addEventListener("beforeunload", () => {
  const toStore = matchesDatabase.map(({ datetimeObj, ...rest }) => rest);
  localStorage.setItem("fifa2026_full_az", JSON.stringify(toStore));
});

console.log("FIFA 2026 World Cup A-Z Hub | Mehedi Tech");