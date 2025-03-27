const playlistName = document.getElementById("playlist-name");
const songName = document.getElementById("song-name");
const cover = document.getElementById("cover");
const artistName = document.getElementById("artist-name");
const song = document.getElementById("audio");
const likeButton = document.getElementById("like");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("current-time");
const totalTime = document.getElementById("duration");

playlistName.innerText = "My Playlist";

const snapOutOfIt = {
  songName: "Snap Out Of It",
  artist: "Arctic Monkeys",
  file: "snap_out_of_it",
  liked: false,
};

const dieWithSmile = {
  songName: "Die With a Smile",
  artist: "Lady Gaga, Bruno Mars",
  file: "die_with_smile",
  liked: false,
};

const unwritten = {
  songName: "Unwritten",
  artist: "Natasha Bedingfield",
  file: "unwritten",
  liked: false,
};

const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [
  snapOutOfIt,
  dieWithSmile,
  unwritten,
];
let index = 0;
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
let sortedPlaylist = [...originalPlaylist]; // ... cópia superficial

function playSong() {
  play.querySelector(".bi").classList.remove("bi-play-circle-fill");
  play.querySelector(".bi").classList.add("bi-pause-circle-fill");
  song.play();
  isPlaying = true;
}

function pauseSong() {
  play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  play.querySelector(".bi").classList.add("bi-play-circle-fill");
  song.pause();
  isPlaying = false;
}

function playPauseDecider() {
  if (isPlaying === true) {
    pauseSong();
  } else {
    playSong();
  }
}

function loadSong() {
  cover.src = `images/${sortedPlaylist[index].file}.png`;
  song.src = `songs/${sortedPlaylist[index].file}.mp3`;
  songName.innerText = sortedPlaylist[index].songName;
  artistName.innerText = sortedPlaylist[index].artist;
  likeButtonRender();
}

function previousSong() {
  if (index === 0) {
    index = sortedPlaylist.length - 1;
  } else {
    index -= 1;
  }
  loadSong();
  playSong();
}

function nextSong() {
  if (index === sortedPlaylist.length - 1) {
    index = 0;
  } else {
    index += 1;
  }
  loadSong();
  playSong();
}

function updateProgress() {
  const barWidth = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty("--progress", `${barWidth}%`);
  songTime.innerText = formatTime(song.currentTime);
}

function jumpTo(event) {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * song.duration;
  song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
  let currentIndex = preShuffleArray.length - 1;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * preShuffleArray.length);
    let aux = preShuffleArray[currentIndex];
    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    preShuffleArray[randomIndex] = aux;
    currentIndex -= 1;
  }
}

function shuffleButtonClicked() {
  if (isShuffled === false) {
    isShuffled = true;
    shuffleArray(sortedPlaylist);
    shuffleButton.classList.add("button-active");
  } else {
    isShuffled = false;
    sortedPlaylist = [...originalPlaylist];
    shuffleButton.classList.remove("button-active");
  }
}

function repeatButtonClicked() {
  if (repeatOn === false) {
    repeatOn = true;
    repeatButton.classList.add("button-active");
  } else {
    repeatOn = false;
    repeatButton.classList.remove("button-active");
  }
}

function nextOrRepeat() {
  if (repeatOn === true) {
    playSong();
  } else {
    nextSong();
  }
}

function formatTime(originalTime) {
  let hours = Math.floor(originalTime / 3600);
  let min = Math.floor((originalTime - hours * 3600) / 60);
  let sec = Math.floor(originalTime - hours * 3600 - min * 60);

  return `${hours.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function updateCurrentTime() {
  songTime.innerText = song.currentTime;
}

function updateTotalTime() {
  totalTime.innerText = formatTime(song.duration);
}

function likeButtonRender() {
  if (sortedPlaylist[index].liked === true) {
    likeButton.querySelector(".bi").classList.remove("bi-heart");
    likeButton.querySelector(".bi").classList.add("bi-heart-fill");
    likeButton.classList.add("button-active");
  } else {
    likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
    likeButton.querySelector(".bi").classList.add("bi-heart");
    likeButton.classList.remove("button-active");
  }
}

function likeButtonClicked() {
  if (sortedPlaylist[index].liked === false) {
    sortedPlaylist[index].liked = true;
    likeButtonRender();
  } else {
    sortedPlaylist[index].liked = false;
    likeButtonRender();
  }
  localStorage.setItem("playlist", JSON.stringify(originalPlaylist));
}

loadSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);
