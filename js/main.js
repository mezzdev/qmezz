const card = document.querySelector("#card");
const links = document.querySelectorAll(".link");
const music = document.querySelector("#music");
const litecoin = document.querySelector("#litecoin");
const copyMessage = document.querySelector("#copy-message");
const copyStatus = document.querySelector("#copy-status");

document.addEventListener("click", () => {
  if (music && music.paused) {
    music.play().catch(() => {});
  }
}, { once: true, capture: true });

if (window.gsap) {
  gsap.from(card, {
    opacity: 0,
    y: 35,
    scale: .96,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".avatar-wrap", {
    opacity: 0,
    scale: .65,
    rotation: -12,
    duration: 1,
    delay: .15,
    ease: "back.out(1.7)"
  });

  gsap.from(".link", {
    opacity: 0,
    y: 14,
    duration: .65,
    stagger: .08,
    delay: .35,
    ease: "power2.out"
  });
}

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

function animateTilt() {
  currentX += (targetX - currentX) * .08;
  currentY += (targetY - currentY) * .08;

  if (window.gsap) {
    gsap.set(card, {
      rotationY: currentX,
      rotationX: -currentY
    });
  } else {
    card.style.transform =
      `rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
  }

  requestAnimationFrame(animateTilt);
}

document.addEventListener("mousemove", (event) => {
  const rect = card.getBoundingClientRect();

  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;

  targetX = x * 8;
  targetY = y * 8;
});

document.addEventListener("mouseleave", () => {
  targetX = 0;
  targetY = 0;
});

animateTilt();

links.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    if (window.gsap) {
      gsap.to(link, {
        x: 4,
        duration: .25,
        ease: "power2.out"
      });
    }
  });

  link.addEventListener("mouseleave", () => {
    if (window.gsap) {
      gsap.to(link, {
        x: 0,
        duration: .25,
        ease: "power2.out"
      });
    }
  });
});

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }

  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let success = false;

  try {
    success = document.execCommand("copy");
  } catch {
    success = false;
  }

  textarea.remove();

  return success;
}

if (litecoin) {
  litecoin.addEventListener("click", async () => {
    const address = litecoin.dataset.address;
    const copied = await copyText(address);

    if (!copied) {
      return;
    }

    if (copyMessage) {
      copyMessage.classList.add("show");

      setTimeout(() => {
        copyMessage.classList.remove("show");
      }, 2000);
    }

    if (copyStatus) {
      copyStatus.textContent = "✓";

      setTimeout(() => {
        copyStatus.textContent = "⧉";
      }, 2000);
    }

    if (window.gsap) {
      gsap.fromTo(
        litecoin,
        { scale: 1 },
        {
          scale: .97,
          duration: .1,
          yoyo: true,
          repeat: 1
        }
      );
    }
  });
}