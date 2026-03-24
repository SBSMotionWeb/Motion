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

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (images[ballAnimation.frame]) context.drawImage(images[ballAnimation.frame], 0, 0);
}
images[0].onload = render;
window.addEventListener("resize", render);

// 1페이지 애니메이션
gsap.to(ballAnimation, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        scrub: 0.3, trigger: ".scroll-height", start: "top top", end: "bottom bottom",
        onUpdate: (self) => {
            render();
            if (self.progress >= 0.99) { isFinished = true; document.body.classList.add("finished"); }
            else { isFinished = false; document.body.classList.remove("finished"); }
        }
    }
});

// 2페이지 진입
window.addEventListener("click", () => {
    if (isFinished) {
        const nextPage = document.getElementById("next-page");
        if(nextPage.classList.contains("active")) return;
        document.body.classList.add("step-2");
        nextPage.classList.add("active");
        
        setTimeout(() => {
            ScrollTrigger.refresh();
            window.scrollTo({ top: document.querySelector(".scroll-height").offsetHeight, behavior: "smooth" });
        }, 100);

        const masterTl = gsap.timeline({
            scrollTrigger: { trigger: ".next-section", start: "top top", end: "bottom bottom", scrub: 0.5 }
        });
        masterTl.to(".moving-content", { y: "-35vh", scale: 0.7, duration: 1 });
        masterTl.to(".curriculum-container", { autoAlpha: 1, y: 0, duration: 0.8 });
        gsap.utils.toArray(".motive-line").forEach((line) => {
            masterTl.to(line, { opacity: 1, duration: 0.5, ease: "none" });
        });
        masterTl.to(".next-arrow-btn", { autoAlpha: 1, y: -10, duration: 0.5 });
    }
});

// 3페이지(Phase 01) 제어
let currentSlideIndex = 1;
const p3NextBtn = document.getElementById("p3-next-slide");
const p3Track = document.querySelector(".p3-slide-track");

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
                trigger: "#page-3", start: "top top", end: "bottom bottom", scrub: 0.5,
                onUpdate: (self) => {
                    if(self.progress > 0.3 && currentSlideIndex === 1) { p3NextBtn.classList.add("visible"); p3NextBtn.querySelector(".p3-btn-text").textContent = "Phase 01-2"; } 
                    else if(self.progress > 0.6 && currentSlideIndex === 2) { p3NextBtn.classList.add("visible"); p3NextBtn.querySelector(".p3-btn-text").textContent = "Phase 01-3"; } 
                    else if(self.progress > 0.95 && currentSlideIndex === 3) { p3NextBtn.classList.add("visible"); p3NextBtn.querySelector(".p3-btn-text").textContent = "Phase 02"; }
                    else { p3NextBtn.classList.remove("visible"); }
                }
            }
        });
        p3Tl.to(".p3-moving-content", { x: "-30vw", y: "-38vh", scale: 0.6, duration: 0.5 });
        p3Tl.to(".p3-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.2");
        gsap.utils.toArray(".p3-line").forEach((line) => { p3Tl.to(line, { opacity: 1, duration: 0.2 }); });
    }, 100);
});

// Phase 01 슬라이드 전환 및 4페이지 이동
p3NextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentSlideIndex === 1) { p3Track.classList.add("step-2"); currentSlideIndex = 2; } 
    else if (currentSlideIndex === 2) { p3Track.classList.add("step-3"); currentSlideIndex = 3; } 
    else if (currentSlideIndex === 3) {
        const p4 = document.getElementById("page-4");
        p4.classList.add("show");
        setTimeout(() => {
            ScrollTrigger.refresh();
            const offset = document.querySelector(".scroll-height").offsetHeight + document.querySelector(".next-section").offsetHeight + document.querySelector(".page-3-section").offsetHeight;
            window.scrollTo({ top: offset, behavior: "smooth" });
            initP4Animation();
        }, 100);
    }
    p3NextBtn.classList.remove("visible");
});

// 4페이지(Phase 02) 제어
let currentP4Index = 1;
const p4NextBtn = document.getElementById("p4-next-slide");
const p4Track = document.querySelector(".p4-slide-track");

function initP4Animation() {
    const p4Tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#page-4", start: "top top", end: "bottom bottom", scrub: 0.5,
            onUpdate: (self) => {
                if(self.progress > 0.4 && currentP4Index === 1) { p4NextBtn.classList.add("visible"); p4NextBtn.querySelector(".p4-btn-text").textContent = "Phase 02-2"; }
                else if(self.progress > 0.9 && currentP4Index === 2) { p4NextBtn.classList.add("visible"); p4NextBtn.querySelector(".p4-btn-text").textContent = "Final Step"; }
                else { p4NextBtn.classList.remove("visible"); }
            }
        }
    });
    p4Tl.to(".p4-moving-content", { x: "-30vw", y: "-38vh", scale: 0.6, duration: 0.5 });
    p4Tl.to(".p4-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.3 });
    gsap.utils.toArray(".p4-line").forEach((line) => { p4Tl.to(line, { opacity: 1, duration: 0.2 }); });
}

p4NextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentP4Index === 1) {
        p4Track.classList.add("step-2");
        currentP4Index = 2;
        p4NextBtn.classList.remove("visible");
    }
});

// [통합 비디오 모달 제어 로직]
const videoModal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const multiVideos = document.querySelectorAll('.multi-v');
const singleContainer = document.getElementById('single-video-container');
const multiContainer = document.getElementById('multi-video-container');

document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video], [data-multi-video]');
    if (!trigger) return;

    videoModal.style.display = 'flex';
    setTimeout(() => videoModal.classList.add('active'), 10);

    if (trigger.hasAttribute('data-video')) {
        singleContainer.classList.add('active');
        multiContainer.classList.remove('active');
        modalVideo.src = trigger.getAttribute('data-video');
        modalVideo.play();
    } else if (trigger.hasAttribute('data-multi-video')) {
        singleContainer.classList.remove('active');
        multiContainer.classList.add('active');
        const videoPaths = trigger.getAttribute('data-multi-video').split(',');
        multiVideos.forEach((v, idx) => { if(videoPaths[idx]) { v.src = videoPaths[idx]; v.play(); } });
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.js-modal-close')) {
        videoModal.classList.remove('active');
        setTimeout(() => { 
            videoModal.style.display = 'none'; 
            modalVideo.pause(); modalVideo.src = "";
            multiVideos.forEach(v => { v.pause(); v.src = ""; });
        }, 400);
    }
});