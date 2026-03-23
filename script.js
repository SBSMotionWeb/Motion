const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");
canvas.width = 1920; canvas.height = 1080;

const frameCount = 149;
const currentFrame = index => (`images/frame_${(index + 1).toString().padStart(5, '0')}.jpg`);
const images = [];
const ballAnimation = { frame: 0 };
let isFinished = false;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// 1페이지 애니메이션
gsap.to(ballAnimation, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.3,
    trigger: ".scroll-height",
    start: "top top", end: "bottom bottom",
    onUpdate: (self) => {
      render();
      if (self.progress >= 0.99) {
        isFinished = true;
        document.body.classList.add("finished");
      } else {
        isFinished = false;
        document.body.classList.remove("finished");
      }
    }
  }
});

// 2페이지 진입 및 애니메이션
window.addEventListener("click", () => {
  if (isFinished) {
    const nextPage = document.getElementById("next-page");
    if(nextPage.classList.contains("active")) return;

    document.body.classList.add("step-2");
    nextPage.classList.add("active");
    ScrollTrigger.refresh();

    window.scrollTo({
      top: document.querySelector(".scroll-height").offsetHeight,
      behavior: "smooth"
    });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".next-section",
        start: "top top", end: "bottom bottom",
        scrub: 0.5,
      }
    });

    masterTl.to(".moving-content", { y: "-35vh", scale: 0.7, duration: 1 });
    masterTl.to(".curriculum-container", { autoAlpha: 1, y: 0, duration: 0.8 });

    gsap.utils.toArray(".motive-line").forEach((line) => {
      masterTl.to(line, { opacity: 1, duration: 0.5, ease: "none" });
    });

    masterTl.to(".next-arrow-btn", { autoAlpha: 1, y: -10, duration: 0.5 });
  }
});

// 3페이지 진입 및 애니메이션 설정
document.getElementById("next-arrow").addEventListener("click", (e) => {
    e.stopPropagation();
    const p3 = document.getElementById("page-3");
    p3.classList.add("show");
    
    setTimeout(() => {
        ScrollTrigger.refresh();
        const offset = document.querySelector(".scroll-height").offsetHeight + document.querySelector(".next-section").offsetHeight;
        window.scrollTo({ top: offset, behavior: "smooth" });

        const p3Tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#page-3",
                start: "top top", end: "bottom bottom",
                scrub: 0.5,
            }
        });

        p3Tl.to(".p3-moving-content", { x: "-30vw", y: "-38vh", scale: 0.6, duration: 1.5 });
        p3Tl.to(".p3-curriculum-container", { autoAlpha: 1, y: -20, duration: 1 }, "-=0.5");

        gsap.utils.toArray(".p3-line").forEach((line) => {
            p3Tl.to(line, { opacity: 1, duration: 0.6, ease: "none" });
        });
    }, 50);
});

// 비디오 팝업 제어 로직 (추가됨)
const videoModal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');

document.addEventListener('click', (e) => {
    // 3페이지 이미지 박스 클릭 시
    const trigger = e.target.closest('.p3-left-image-box');
    if (trigger) {
        const videoSrc = trigger.getAttribute('data-video');
        if (videoSrc) {
            modalVideo.src = videoSrc;
            videoModal.style.display = 'flex';
            setTimeout(() => videoModal.classList.add('active'), 10);
            modalVideo.play();
        }
    }
    // 모달 닫기 (오버레이나 닫기 버튼 클릭 시)
    if (e.target.closest('.js-modal-close')) {
        videoModal.classList.remove('active');
        setTimeout(() => {
            videoModal.style.display = 'none';
            modalVideo.pause();
            modalVideo.src = "";
        }, 400);
    }
});

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (images[ballAnimation.frame]) context.drawImage(images[ballAnimation.frame], 0, 0);
}
images[0].onload = render;
window.addEventListener("resize", render);