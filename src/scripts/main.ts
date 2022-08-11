import "../styles/main.css";

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ---- Selectors ---- //
const countdownDaysElement = document.querySelector("[data-countdown-days]") as HTMLElement;
const countdownHoursElement = document.querySelector("[data-countdown-hours]") as HTMLElement;
const countdownMinutesElement = document.querySelector("[data-countdown-minutes]") as HTMLElement;
const countdownSecondsElement = document.querySelector("[data-countdown-seconds]") as HTMLElement;

// ---- Helpers ---- //
const padNumber = (value: number) => value.toString().padStart(2, "0");

function formatCountdownValues(secondsRemaining: number): CountdownValues {
  const days = Math.floor(secondsRemaining / (60 * 60 * 24));
  const hours = Math.floor((secondsRemaining / (60 * 60)) % 24);
  const minutes = Math.floor((secondsRemaining / 60) % 60);
  const seconds = Math.floor(secondsRemaining % 60);
  return { days, hours, minutes, seconds };
}

function getSecondsRemaining(deadline: number) {
  const currentDate = new Date().valueOf();
  const diffToDeadline = Math.abs(currentDate - deadline);
  const secondsRemaining = Math.ceil(diffToDeadline / 1000);
  return secondsRemaining;
}

function initElement(element: HTMLElement, value: number) {
  const children = Array.from(element.children) as HTMLElement[];
  children.forEach((child) => (child.innerText = padNumber(value)));
}

// ---- Countdown ---- //
const DEADLINE = new Date().setSeconds(new Date().getSeconds() + 777341).valueOf(); // 8days, 23hours, 55minutes, 41seconds

function initCountdown() {
  const initSecondsRemaining = getSecondsRemaining(DEADLINE);
  const initCountdownValues = formatCountdownValues(initSecondsRemaining);
  initElement(countdownDaysElement, initCountdownValues.days);
  initElement(countdownHoursElement, initCountdownValues.hours);
  initElement(countdownMinutesElement, initCountdownValues.minutes);
  initElement(countdownSecondsElement, initCountdownValues.seconds);
}

function flip(flipCard: HTMLElement, nextNumber: number) {
  const topHalf = flipCard.querySelector(".top-half") as HTMLElement;
  const startNumber = parseInt(topHalf.textContent!);

  if (nextNumber === startNumber) return;

  const bottomHalf = flipCard.querySelector(".bottom-half") as HTMLElement;
  const flipTop = document.createElement("span");
  flipTop.classList.add("flip-top");
  const flipBottom = document.createElement("span");
  flipBottom.classList.add("flip-bottom");

  topHalf.textContent = padNumber(startNumber);
  bottomHalf.textContent = padNumber(startNumber);

  flipTop.textContent = padNumber(startNumber);
  flipBottom.textContent = padNumber(nextNumber);

  flipTop.addEventListener("animationstart", () => {
    topHalf.textContent = padNumber(nextNumber);
  });

  flipTop.addEventListener("animationend", () => {
    flipTop.remove();
  });

  flipBottom.addEventListener("animationend", () => {
    bottomHalf.textContent = padNumber(nextNumber);
    flipBottom.remove();
  });

  flipCard.append(flipTop, flipBottom);
}

function updateCountdown(secondsRemaining: number) {
  const { days, hours, minutes, seconds } = formatCountdownValues(secondsRemaining);

  flip(countdownDaysElement, days);
  flip(countdownHoursElement, hours);
  flip(countdownMinutesElement, minutes);
  flip(countdownSecondsElement, seconds);
}

// Initialize countdown
initCountdown();

// Start countdown
let previousSecondsRemaining: number;
setInterval(() => {
  const secondsRemaining = getSecondsRemaining(DEADLINE);
  if (previousSecondsRemaining !== secondsRemaining) {
    updateCountdown(secondsRemaining);
  }
  previousSecondsRemaining = secondsRemaining;
}, 100);
