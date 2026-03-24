// 01. Initial Setup & Canvas Engine
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");
canvas.width = 1920; canvas.height = 1080;

const frameCount = 149;
const currentFrame = index => (`images/frame_${(index + 1).toString().padStart(5, '0')}.jpg`);
const images = [];
const ballAnimation = { frame: 0 };
let isFinished = false;
let masterTl, p3Tl, p4Tl;

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

// Canvas Sequence Animation
gsap.to(ballAnimation, {
    frame: frameCount - 1, snap: "frame", ease: "none",
    scrollTrigger: {
        scrub: 0.3, trigger: ".scroll-height", start: "top top", end: "bottom bottom",
        onUpdate: (self) => { render(); isFinished = self.progress >= 0.99; }
    }
});

// 02. Entry Navigation Logic
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

        masterTl = gsap.timeline({
            scrollTrigger: { trigger: ".next-section", start: "top top", end: "bottom bottom", scrub: 0.8 }
        });
        masterTl.to(".moving-content", { y: "-35vh", scale: 0.75, duration: 1.2, ease: "power2.out" });
        masterTl.to(".selection-container", { autoAlpha: 1, y: 0, duration: 1, ease: "back.out(1.2)" }, "-=0.4");
    }
});

// Selection Button Interaction (AE)
const aeBtn = document.getElementById("btn-ae");
aeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    aeBtn.style.borderColor = "#9747ff";
    aeBtn.style.background = "rgba(151, 71, 255, 0.08)";
    document.getElementById("page-3").classList.add("show");
    setTimeout(() => {
        ScrollTrigger.refresh();
        const offset = document.querySelector(".scroll-height").offsetHeight + document.querySelector(".next-section").offsetHeight;
        window.scrollTo({ top: offset, behavior: "smooth" });
        initP3Animation(); 
    }, 300);
});

// 03. Phase 01 Animation (Synced with P2 Style)
let currentSlideIndex = 1;
function initP3Animation() {
    const p3NextBtn = document.getElementById("p3-next-slide");
    const p3Track = document.querySelector(".p3-slide-track");
    
    if(p3Tl) p3Tl.kill();

    p3Tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#page-3", start: "top top", end: "bottom bottom", scrub: 0.3,
            onUpdate: (self) => {
                const btnText = p3NextBtn.querySelector(".p3-btn-text");
                if(self.progress > 0.3 && currentSlideIndex === 1) { p3NextBtn.classList.add("visible"); btnText.textContent = "Phase 01-2"; } 
                else if(self.progress > 0.6 && currentSlideIndex === 2) { p3NextBtn.classList.add("visible"); btnText.textContent = "Phase 01-3"; } 
                else if(self.progress > 0.95 && currentSlideIndex === 3) { p3NextBtn.classList.add("visible"); btnText.textContent = "Next Phase"; }
                else { p3NextBtn.classList.remove("visible"); }
            }
        }
    });

    p3Tl.to(".p3-moving-content", { x: "-30vw", y: "-38vh", scale: 0.6, duration: 0.45, ease: "power1.inOut" });
    p3Tl.to(".p3-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.15");
    
    gsap.utils.toArray(".p3-line").forEach((line) => { 
        p3Tl.to(line, { opacity: 1, duration: 0.2 }); 
    });

    p3NextBtn.onclick = (e) => {
        e.stopPropagation();
        if (currentSlideIndex === 1) { p3Track.classList.add("step-2"); currentSlideIndex = 2; } 
        else if (currentSlideIndex === 2) { p3Track.classList.add("step-3"); currentSlideIndex = 3; } 
        else if (currentSlideIndex === 3) {
            document.getElementById("page-4").classList.add("show");
            setTimeout(() => {
                ScrollTrigger.refresh();
                const offset = document.querySelector(".scroll-height").offsetHeight + 
                               document.querySelector(".next-section").offsetHeight + 
                               document.querySelector(".page-3-section").offsetHeight;
                window.scrollTo({ top: offset, behavior: "smooth" });
                initP4Animation();
            }, 100);
        }
        p3NextBtn.classList.remove("visible");
    };
}

// 04. Phase 02 Animation
let currentP4Index = 1;
function initP4Animation() {
    const p4NextBtn = document.getElementById("p4-next-slide");
    const p4Track = document.querySelector(".p4-slide-track");
    const btnText = p4NextBtn.querySelector(".p4-btn-text");

    if(p4Tl) p4Tl.kill();

    p4Tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#page-4", start: "top top", end: "bottom bottom", scrub: 0.3,
            onUpdate: (self) => {
                if(self.progress > 0.45 && currentP4Index === 1) { p4NextBtn.classList.add("visible"); btnText.textContent = "Phase 02-2"; }
                else if(self.progress > 0.85 && currentP4Index === 2) { p4NextBtn.classList.add("visible"); btnText.textContent = "Back"; }
                else { p4NextBtn.classList.remove("visible"); }
            }
        }
    });

    p4Tl.to(".p4-moving-content", { x: "-30vw", y: "-38vh", scale: 0.6, duration: 0.45, ease: "power1.inOut" });
    p4Tl.to(".p4-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.15");
    gsap.utils.toArray(".p4-line").forEach((line) => { p4Tl.to(line, { opacity: 1, duration: 0.2 }); });

    p4NextBtn.onclick = (e) => {
        e.stopPropagation();
        if (currentP4Index === 1) { p4Track.classList.add("step-2"); currentP4Index = 2; p4NextBtn.classList.remove("visible"); } 
        else if (currentP4Index === 2 && btnText.textContent === "Back") {
            const menuStart = document.querySelector(".scroll-height").offsetHeight;
            const menuHeight = document.querySelector(".next-section").offsetHeight;
            const targetJump = menuStart + (menuHeight * 0.85);

            window.scrollTo({ top: targetJump, behavior: "auto" });

            if(masterTl) masterTl.progress(1);
            if(p3Tl) { p3Tl.progress(0); p3Tl.kill(); }
            if(p4Tl) { p4Tl.progress(0); p4Tl.kill(); }

            document.getElementById("page-3").classList.remove("show");
            document.getElementById("page-4").classList.remove("show");
            document.querySelector(".p3-slide-track").classList.remove("step-2", "step-3");
            document.querySelector(".p4-slide-track").classList.remove("step-2");
            
            gsap.set(".p3-moving-content, .p3-curriculum-container, .p3-line, .p4-moving-content, .p4-curriculum-container, .p4-line", { clearProps: "all" });

            currentSlideIndex = 1; currentP4Index = 1;
            aeBtn.style.borderColor = "rgba(255, 255, 255, 0.1)";
            aeBtn.style.background = "#111";
            ScrollTrigger.refresh();
        }
    };
}

// 05. Video Modal Controller
const videoModal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const multiVideos = document.querySelectorAll('.multi-v');
const singleContainer = document.getElementById('single-video-container');
const multiContainer = document.getElementById('multi-video-container');

document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video], [data-multi-video]');
    if (!trigger) return;
    videoModal.classList.add('active');
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
        modalVideo.pause(); modalVideo.src = "";
        multiVideos.forEach(v => { v.pause(); v.src = ""; });
    }
});