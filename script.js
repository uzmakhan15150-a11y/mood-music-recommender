let mood = localStorage.getItem("mood") || "happy";
let lang = localStorage.getItem("lang") || "hindi";
let currentSong = "";
let favorites = JSON.parse(localStorage.getItem("fav")) || [];


const songs = {
  happy: {
    hindi: ["songs/happy_hindi.mp3","songs/happy2_hindi.mp3"],
    english: ["songs/happy_english.mp3"],
    marathi: ["songs/happy_marathi.mp3"]
  },
  sad: {
    hindi: ["songs/sad_hindi.mp3"],
    english: ["songs/sad_english.mp3"],
    marathi: ["songs/sad_marathi.mp3"]
  },
  calm: {
    hindi: ["songs/hindi_calm.mp3"],
    english: ["songs/calm_english.mp3"],
    marathi: ["songs/calm_marathi.mp3"]
  }
};

// Clean name
function getCleanName(song) {
  return song.split("/").pop()
    .replace(".mp3","")
    .replaceAll("_"," ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Load songs
function loadSongs(filter="") {
  const list = document.getElementById("songList");
  list.innerHTML = "";

  songs[mood][lang]
    .filter(song => song.toLowerCase().includes(filter.toLowerCase()))
    .forEach(song => {

      const li = document.createElement("li");
      li.textContent = getCleanName(song);

      // ❤️ favorite indicator
      if (favorites.includes(song)) {
        li.textContent += " ❤️";
      }

      li.onclick = () => {
        playSong(song);

        document.querySelectorAll("li").forEach(i => i.classList.remove("activeSong"));
        li.classList.add("activeSong");
      };

      // Right click for favorite
      li.oncontextmenu = (e) => {
        e.preventDefault();
        toggleFav(song);
        loadSongs();
      };

      list.appendChild(li);
    });
}

// Play
function playSong(song) {
  currentSong = song;
  const player = document.getElementById("player");
  const name = document.getElementById("songName");

  player.src = song;
  player.play();

  name.textContent = "Now Playing: " + getCleanName(song);
}

// Controls
function nextSong() {
  const list = songs[mood][lang];
  let i = list.indexOf(currentSong);
  if (i < list.length - 1) playSong(list[i+1]);
}

function prevSong() {
  const list = songs[mood][lang];
  let i = list.indexOf(currentSong);
  if (i > 0) playSong(list[i-1]);
}

// Auto next
document.getElementById("player").addEventListener("ended", nextSong);

// Download
function downloadSong() {
  if (!currentSong) return alert("Select song first!");
  const a = document.createElement("a");
  a.href = currentSong;
  a.download = currentSong.split("/").pop();
  a.click();
}

// Favorites
function toggleFav(song) {
  if (favorites.includes(song)) {
    favorites = favorites.filter(s => s !== song);
  } else {
    favorites.push(song);
  }
  localStorage.setItem("fav", JSON.stringify(favorites));
}

// Mood / Lang
function selectMood(m) {
  mood = m;
  localStorage.setItem("mood", m);
  loadSongs();
}

function selectLang(l) {
  lang = l;
  localStorage.setItem("lang", l);
  loadSongs();
}

// Search
document.getElementById("search").addEventListener("input", e => {
  loadSongs(e.target.value);
});

// Init
loadSongs();