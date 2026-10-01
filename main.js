const card = document.querySelector("#card");
const links = document.querySelectorAll(".link");
const music = document.querySelector("#music");
const litecoin = document.querySelector("#litecoin");
const copyMessage = document.querySelector("#copy-message");
const copyStatus = document.querySelector("#copy-status");

const avatarWrap = document.querySelector(".avatar-wrap");
const identity = document.querySelector(".identity");
const bio = document.querySelector(".bio");
const linksContainer = document.querySelector(".links");
const footer = document.querySelector(".footer");

document.addEventListener("click", () => {
  if (music && music.paused) {
    music.play().catch(() => {});
  }
}, {
  once: true,
  capture: true
});

if (window.gsap && card) {
  const introElements = [
    card,
    avatarWrap,
    identity,
    bio,
    linksContainer,
    footer
  ].filter(Boolean);

  gsap.set(card, {
    autoAlpha: 0,
    y: 40,
    scale: 0.94
  });

  if (avatarWrap) {
    gsap.set(avatarWrap, {
      autoAlpha: 0,
      scale: 0.55,
      rotation: -18
    });
  }

  if (identity) {
    gsap.set(identity, {
      autoAlpha: 0,
      y: 18
    });
  }

  if (bio) {
    gsap.set(bio, {
      autoAlpha: 0,
      y: 15
    });
  }

  if (linksContainer) {
    gsap.set(linksContainer, {
      autoAlpha: 0,
      y: 18
    });
  }

  if (links.length) {
    gsap.set(links, {
      autoAlpha: 0,
      x: -28,
      y: 10,
      scale: 0.97
    });
  }

  if (footer) {
    gsap.set(footer, {
      autoAlpha: 0,
      y: 12
    });
  }


  const intro = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });

  intro.to(card, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.85,
    ease: "power3.out"
  });

  if (avatarWrap) {
    intro.to(avatarWrap, {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      duration: 0.9,
      ease: "back.out(1.8)"
    }, "-=0.55");
  }

  if (identity) {
    intro.to(identity, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.55");
  }

  if (bio) {
    intro.to(bio, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.32");
  }

  if (linksContainer) {
    intro.to(linksContainer, {
      autoAlpha: 1,
      y: 0,
      duration: 0.35,
      ease: "power2.out"
    }, "-=0.25");
  }

  if (links.length) {
    intro.to(links, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.55,
      stagger: {
        each: 0.08,
        from: "start"
      },
      ease: "back.out(1.25)"
    }, "-=0.15");
  }

  if (footer) {
    intro.to(footer, {
      autoAlpha: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out"
    }, "-=0.25");
  }

  intro.call(() => {
    gsap.to(card, {
      y: -3,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
}

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

function animateTilt() {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;

  if (card && window.gsap) {
    gsap.set(card, {
      rotationY: currentX,
      rotationX: -currentY
    });
  }

  requestAnimationFrame(animateTilt);
}

if (card) {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
      rect.height -
      0.5;

    targetX = x * 9;
    targetY = y * 9;
  });

  card.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });
}

animateTilt();

links.forEach((link) => {
  const icon = link.querySelector(".icon");
  const arrow = link.querySelector(".arrow");

  link.addEventListener("mouseenter", () => {
    if (!window.gsap) {
      return;
    }

    gsap.killTweensOf([
      link,
      icon,
      arrow
    ].filter(Boolean));

    gsap.to(link, {
      x: 7,
      scale: 1.018,
      duration: 0.3,
      ease: "power3.out"
    });

    if (icon) {
      gsap.to(icon, {
        scale: 1.1,
        rotation: 4,
        duration: 0.28,
        ease: "back.out(2)"
      });
    }

    if (arrow) {
      gsap.to(arrow, {
        x: 4,
        duration: 0.25,
        ease: "power2.out"
      });
    }
  });


  link.addEventListener("mouseleave", () => {
    if (!window.gsap) {
      return;
    }

    gsap.to(link, {
      x: 0,
      scale: 1,
      duration: 0.3,
      ease: "power3.out"
    });

    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.25,
        ease: "power2.out"
      });
    }

    if (arrow) {
      gsap.to(arrow, {
        x: 0,
        duration: 0.25,
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

    if (!address) {
      return;
    }

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
      gsap.timeline()
        .to(litecoin, {
          scale: 0.96,
          duration: 0.1,
          ease: "power2.out"
        })
        .to(litecoin, {
          scale: 1.02,
          duration: 0.12,
          ease: "back.out(2)"
        })
        .to(litecoin, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
    }
  });
}