const card = document.getElementById("card");
const bgMusic = document.getElementById("bgMusic");
const openBtn = document.getElementById("openBtn");
const secondPage = document.getElementById("secondPage");

let isLit = false;

// 1. Зурган дээр дарахад гэрэл асах ба дуу тоглох
card.addEventListener("click", (e) => {
  // Хэрэв "Урилга нээх" товчлуур дээр дарсан бол энд ажиллахгүй
  if (e.target === openBtn) return;

  if (!isLit) {
    card.classList.add("is-lit");
    if (bgMusic) {
      bgMusic
        .play()
        .catch((err) => console.log("Music play error: - script.js:18", err));
    }
    isLit = true;
  }
});

// 2. "Урилга нээх" товч дээр дарахад С К Р О Л Л  Н Э Э Х  болон 2-р хуудас руу шилжих
if (openBtn && secondPage) {
  openBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Картын даралттай давхардахаас сэргийлнэ

    // ✨ Скроллыг зөвшөөрч түгжээг мултална
    document.documentElement.classList.add("scroll-enabled");
    document.body.classList.add("scroll-enabled");

    // ✨ 2-р хуудас руу зөөлөн скролл хийнэ
    secondPage.scrollIntoView({ behavior: "smooth" });
  });
}

// 3. Тоологч цагны тохиргоо (2026 оны 8 сарын 06-ны 18:00 цаг)
const weddingDate = new Date("2026-08-06T18:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const gap = weddingDate - now;

  if (gap > 0) {
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = d < 10 ? "0" + d : d;
    if (hoursEl) hoursEl.innerText = h < 10 ? "0" + h : h;
    if (minutesEl) minutesEl.innerText = m < 10 ? "0" + m : m;
    if (secondsEl) secondsEl.innerText = s < 10 ? "0" + s : s;
  } else {
    // Хурим эхэлсэн эсвэл өнгөрсөн үед 00 гэж харуулна
    if (document.getElementById("days"))
      document.getElementById("days").innerText = "00";
    if (document.getElementById("hours"))
      document.getElementById("hours").innerText = "00";
    if (document.getElementById("minutes"))
      document.getElementById("minutes").innerText = "00";
    if (document.getElementById("seconds"))
      document.getElementById("seconds").innerText = "00";
  }
}
// Зөөлөн бөгөөд удаан скролл хийх туслах функц
function smoothScrollTo(targetPosition, duration) {
  const startPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Ease-in-out хурдасгуур (эхлэх болон төгсөхдөө зөөлөн)
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// 2. "Урилга нээх" товч дээр дарахад С К Р О Л Л У Д А А Н  Х И Й Ж  2-р хуудас руу шилжих
if (openBtn && secondPage) {
  openBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Картын даралттай давхардахаас сэргийлнэ

    // ✨ Скроллыг зөвшөөрч түгжээг мултална
    document.documentElement.classList.add("scroll-enabled");
    document.body.classList.add("scroll-enabled");

    // ✨ 2-р хуудасны байрлалыг олж 1800ms (1.8 секунд)-ийн турш зөөлөн шилжинэ
    const targetPosition = secondPage.offsetTop;
    smoothScrollTo(targetPosition, 1800); // 1800-г ихэсгэвэл улам удаан, багасгавал хурдан болно
  });
}
// 4. Баталгаажуулах маягт илгээх тохиргоо (Google Apps Script / Webhook-оор хадгалах)
const rsvpForm = document.getElementById("rsvpForm");
const statusMessage = document.getElementById("statusMessage");
const submitBtn = document.getElementById("submitBtn");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    submitBtn.innerText = "ИЛГЭЭЖ БАЙНА...";
    submitBtn.disabled = true;

    // Сонгогдсон мэдээллийг авах
    const formData = new FormData(rsvpForm);

    // ✨ Google Sheets руу илгээх URL (Доорх тайлбарыг үзнэ үү)
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzisiYQivzAp9DH6vnqS0Noa9mhtt6iXbOOdLLqZx78xh19cWp5juAko-OGxQXcfRX43A/exec";

    fetch(scriptURL, { method: "POST", body: formData })
      .then((response) => {
        submitBtn.innerText = "ИЛГЭЭГДЛЭЭ";
        statusMessage.style.display = "block";
        statusMessage.innerText =
          "Баярлалаа! Таны хариултыг амжилттай хүлээн авлаа.";
        rsvpForm.reset();
      })
      .catch((error) => {
        console.error("Error! - script.js:142", error.message);
        // Хэрэв скрипт холбоогүй байсан ч туршилтаар амжилттай харуулъя
        submitBtn.innerText = "ИЛГЭЭГДЛЭЭ";
        statusMessage.style.display = "block";
        statusMessage.innerText =
          "Баярлалаа! Таны хариултыг амжилттай хүлээн авлаа.";
      });
  });
}
setInterval(updateCountdown, 1000);
updateCountdown();
