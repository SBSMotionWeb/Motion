// 01. Canvas Engine Setup
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");
canvas.width = 1920; canvas.height = 1080;
const frameCount = 149;
const images = [];
const ballAnimation = { frame: 0 };
let isFinished = false;
let masterTl, p3Tl, p4Tl, c4dTl, unrealTl;

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = `images/frame_${(i + 1).toString().padStart(5, '0')}.jpg`;
    images.push(img);
}
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (images[ballAnimation.frame]) context.drawImage(images[ballAnimation.frame], 0, 0);
}
images[0].onload = render;

gsap.to(ballAnimation, {
    frame: frameCount - 1, snap: "frame", ease: "none",
    scrollTrigger: {
        scrub: 0.3, trigger: ".scroll-height", start: "top top", end: "bottom bottom",
        onUpdate: (self) => { render(); isFinished = self.progress >= 0.99; }
    }
});

// 02. Entry Logic
const nextPage = document.getElementById("next-page");
window.addEventListener("click", () => {
    if (isFinished && !nextPage.classList.contains("active")) {
        activateMainMenu();
    }
});
function activateMainMenu() {
    document.body.classList.add("step-2");
    nextPage.classList.add("active");
    setTimeout(() => {
        ScrollTrigger.refresh();
        window.scrollTo({ top: document.querySelector(".scroll-height").offsetHeight, behavior: "auto" });
    }, 100);
    masterTl = gsap.timeline({ scrollTrigger: { trigger: ".next-section", start: "top top", end: "bottom bottom", scrub: 0.8 } });
    masterTl.to(".moving-content", { y: "-35vh", scale: 0.75, duration: 1.2 });
    masterTl.to(".selection-container", { autoAlpha: 1, y: 0, duration: 1 }, "-=0.4");
}

function hideAllSections() {
    const sections = ['page-3', 'page-4', 'page-c4d', 'page-unreal'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove("show");
    });
    document.querySelectorAll('.p3-slide, .p4-slide, .c4d-slide, .unreal-slide').forEach(s => s.classList.remove("active"));
    document.querySelectorAll('.p3-slide-track, .p4-slide-track, .c4d-slide-track, .unreal-slide-track').forEach(t => t.classList.remove("step-2", "step-3"));
    if(p3Tl) p3Tl.kill(); if(p4Tl) p4Tl.kill(); if(c4dTl) c4dTl.kill(); if(unrealTl) unrealTl.kill();
}

// 03. After Effects Logic
document.getElementById("btn-ae").addEventListener("click", () => {
    hideAllSections();
    document.getElementById("page-3").classList.add("show");
    document.querySelector(".p3-slide-1").classList.add("active");
    setTimeout(() => {
        ScrollTrigger.refresh();
        const target = document.querySelector(".scroll-height").offsetHeight + document.querySelector(".next-section").offsetHeight;
        window.scrollTo({ top: target, behavior: "smooth" });
        initP3Animation();
    }, 200);
});

function initP3Animation() {
    const p3NextBtn = document.getElementById("p3-next-slide");
    const p3Track = document.querySelector(".p3-slide-track");
    let currentSlide = 1;

    p3Tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#page-3", start: "top top", end: "bottom bottom", scrub: 0.3,
            onUpdate: (self) => {
                const btnText = p3NextBtn.querySelector(".p3-btn-text");
                if(self.progress > 0.3 && currentSlide === 1) { p3NextBtn.classList.add("visible"); btnText.textContent = "Phase 01-2"; } 
                else if(self.progress > 0.6 && currentSlide === 2) { p3NextBtn.classList.add("visible"); btnText.textContent = "Phase 01-3"; } 
                else if(self.progress > 0.9 && currentSlide === 3) { p3NextBtn.classList.add("visible"); btnText.textContent = "Go Phase 02"; }
                else { p3NextBtn.classList.remove("visible"); }
            }
        }
    });

    p3Tl.to(".p3-moving-content", { x: "-30vw", y: "-38vh", scale: 0.6, duration: 0.45, ease: "power1.inOut" });
    p3Tl.to(".p3-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.15");
    gsap.utils.toArray(".p3-line").forEach((line) => { p3Tl.to(line, { opacity: 1, duration: 0.2 }); });

    p3NextBtn.onclick = () => {
        if (currentSlide === 1) { 
            p3Track.classList.add("step-2"); 
            document.querySelector(".p3-slide-2").classList.add("active");
            currentSlide = 2; 
        } 
        else if (currentSlide === 2) { 
            p3Track.classList.add("step-3"); 
            document.querySelector(".p3-slide-3").classList.add("active");
            currentSlide = 3; 
        } 
        else if (currentSlide === 3) {
            document.getElementById("page-4").classList.add("show");
            document.querySelector(".p4-slide-1").classList.add("active");
            setTimeout(() => {
                ScrollTrigger.refresh();
                const target = document.querySelector(".scroll-height").offsetHeight + 
                               document.querySelector(".next-section").offsetHeight + 
                               document.querySelector(".page-3-section").offsetHeight;
                window.scrollTo({ top: target, behavior: "smooth" });
                initP4Animation();
            }, 100);
        }
        p3NextBtn.classList.remove("visible");
    };
}

function initP4Animation() {
    const p4NextBtn = document.getElementById("p4-next-slide");
    const p4Track = document.querySelector(".p4-slide-track");
    let currentP4 = 1;

    p4Tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#page-4", start: "top top", end: "bottom bottom", scrub: 0.3,
            onUpdate: (self) => {
                const btnText = p4NextBtn.querySelector(".p4-btn-text");
                if(self.progress > 0.4 && currentP4 === 1) { p4NextBtn.classList.add("visible"); btnText.textContent = "Phase 02-2"; }
                else if(self.progress > 0.8 && currentP4 === 2) { p4NextBtn.classList.add("visible"); btnText.textContent = "Back to Main"; }
                else { p4NextBtn.classList.remove("visible"); }
            }
        }
    });

    p4Tl.to(".p4-moving-content", { x: "-30vw", y: "-38vh", scale: 0.6, duration: 0.45, ease: "power1.inOut" });
    p4Tl.to(".p4-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.15");
    gsap.utils.toArray(".p4-line").forEach((line) => { p4Tl.to(line, { opacity: 1, duration: 0.2 }); });

    p4NextBtn.onclick = () => {
        const btnText = p4NextBtn.querySelector(".p4-btn-text");
        if (currentP4 === 1) { 
            p4Track.classList.add("step-2"); 
            document.querySelector(".p4-slide-2").classList.add("active");
            currentP4 = 2; 
            p4NextBtn.classList.remove("visible"); 
        } 
        else if (btnText.textContent === "Back to Main") {
            const mainTarget = document.querySelector(".scroll-height").offsetHeight + (document.querySelector(".next-section").offsetHeight * 0.9); 
            hideAllSections();
            window.scrollTo({ top: mainTarget, behavior: "auto" });
            setTimeout(() => { ScrollTrigger.refresh(); }, 10);
        }
    };
}

// 04. Cinema 4D Logic
document.getElementById("btn-c4d").addEventListener("click", () => {
    hideAllSections();
    document.getElementById("page-c4d").classList.add("show");
    document.querySelector(".c4d-slide-1").classList.add("active");
    const autoVideo = document.getElementById('c4d-auto-video');
    if(autoVideo) { autoVideo.currentTime = 0; autoVideo.play().catch(e => {}); }

    setTimeout(() => {
        ScrollTrigger.refresh();
        const target = document.querySelector(".scroll-height").offsetHeight + document.querySelector(".next-section").offsetHeight;
        window.scrollTo({ top: target, behavior: "smooth" });
        initC4DAnimation();
    }, 200);
});

function initC4DAnimation() {
    const c4dNextBtn = document.getElementById("c4d-next-slide");
    const c4dTrack = document.getElementById("c4d-track");
    const c4dMainTitle = document.getElementById("c4d-main-title");
    let c4dStep = 1;

    c4dTl = gsap.timeline({
        scrollTrigger: { 
            trigger: "#page-c4d", start: "top top", end: "bottom bottom", scrub: 0.2,
            onUpdate: (self) => { 
                const btnText = c4dNextBtn.querySelector(".c4d-btn-text");
                if(self.progress > 0.3) {
                    c4dNextBtn.classList.add("visible");
                    if(c4dStep === 1) btnText.textContent = "Go to Phase 02";
                    else if(c4dStep === 2) btnText.textContent = "Go to Phase 03";
                    else if(c4dStep === 3) btnText.textContent = "Back to Main";
                } else {
                    c4dNextBtn.classList.remove("visible");
                }
            }
        }
    });

    c4dTl.to(".c4d-moving-content", { x: "-30vw", y: "-38vh", scale: 0.5, duration: 0.3 });
    c4dTl.to(".c4d-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.2 }, "-=0.1");
    gsap.utils.toArray(".c4d-line").forEach(l => c4dTl.to(l, { opacity: 1, duration: 0.1 }, ">-0.05"));

    c4dNextBtn.onclick = () => {
        if (c4dStep === 1) {
            c4dTrack.classList.add("step-2");
            document.querySelector(".c4d-slide-2").classList.add("active");
            c4dMainTitle.textContent = "Phase 02"; 
            c4dStep = 2;
            const v2 = document.getElementById('c4d-auto-video-p2');
            if(v2) { v2.currentTime = 0; v2.play().catch(e => {}); }
            c4dNextBtn.classList.remove("visible");
        } 
        else if (c4dStep === 2) {
            c4dTrack.classList.remove("step-2");
            c4dTrack.classList.add("step-3");
            document.querySelectorAll(".c4d-slide").forEach(s => s.classList.remove("active"));
            document.querySelector(".c4d-slide-3").classList.add("active");
            c4dMainTitle.textContent = "Phase 03";
            c4dStep = 3;
            const v3 = document.getElementById('c4d-auto-video-p3');
            if(v3) { v3.currentTime = 0; v3.play().catch(e => {}); }
            c4dNextBtn.classList.remove("visible");
        }
        else {
            const mainTarget = document.querySelector(".scroll-height").offsetHeight + (document.querySelector(".next-section").offsetHeight * 0.9); 
            hideAllSections();
            window.scrollTo({ top: mainTarget, behavior: "auto" });
            c4dMainTitle.textContent = "Phase 01";
            c4dStep = 1;
            setTimeout(() => { ScrollTrigger.refresh(); }, 10);
        }
    };
}

// 05. Unreal Engine Logic (자동재생 및 팝업 연결)
document.getElementById("btn-unreal").onclick = () => {
    hideAllSections();
    document.getElementById("page-unreal").classList.add("show");
    document.querySelector(".unreal-slide-1").classList.add("active");
    
    // Phase 01 진입 시 자동 재생
    const unrealVideo = document.getElementById('unreal-auto-video');
    if(unrealVideo) { 
        unrealVideo.currentTime = 0; 
        unrealVideo.play().catch(e => {}); 
    }

    setTimeout(() => {
        ScrollTrigger.refresh();
        const target = document.querySelector(".scroll-height").offsetHeight + document.querySelector(".next-section").offsetHeight;
        window.scrollTo({ top: target, behavior: "smooth" });
        initUnrealAnimation();
    }, 200);
};

function initUnrealAnimation() {
    const unrealNextBtn = document.getElementById("unreal-next-slide");
    unrealTl = gsap.timeline({
        scrollTrigger: { 
            trigger: "#page-unreal", start: "top top", end: "bottom bottom", scrub: 0.2,
            onUpdate: (self) => { 
                if(self.progress > 0.4) unrealNextBtn.classList.add("visible");
                else unrealNextBtn.classList.remove("visible");
            }
        }
    });
    unrealTl.to(".unreal-moving-content", { x: "-30vw", y: "-38vh", scale: 0.5, duration: 0.3 });
    unrealTl.to(".unreal-curriculum-container", { autoAlpha: 1, y: 0, duration: 0.2 }, "-=0.1");
    gsap.utils.toArray(".unreal-line").forEach(l => unrealTl.to(l, { opacity: 1, duration: 0.1 }, ">-0.05"));
    unrealNextBtn.onclick = () => {
        const mainTarget = document.querySelector(".scroll-height").offsetHeight + (document.querySelector(".next-section").offsetHeight * 0.9); 
        hideAllSections();
        window.scrollTo({ top: mainTarget, behavior: "auto" });
        setTimeout(() => { ScrollTrigger.refresh(); }, 10);
    };
}

document.getElementById("btn-portfolio").onclick = () => alert("Portfolio Class Coming Soon!");

// 06. Video Modal Logic (기존 유지)
const videoModal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const multiVideos = document.querySelectorAll('.multi-v');
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video], [data-multi-video]');
    if (!trigger) return;
    videoModal.classList.add('active');
    if (trigger.hasAttribute('data-video')) {
        document.getElementById('single-video-container').classList.add('active');
        document.getElementById('multi-video-container').classList.remove('active');
        modalVideo.src = trigger.getAttribute('data-video');
        modalVideo.play();
    } else {
        document.getElementById('single-video-container').classList.remove('active');
        document.getElementById('multi-video-container').classList.add('active');
        const paths = trigger.getAttribute('data-multi-video').split(',');
        multiVideos.forEach((v, i) => { if(paths[i]) { v.src = paths[i]; v.play(); } });
    }
});
document.addEventListener('click', (e) => {
    if (e.target.closest('.js-modal-close')) {
        videoModal.classList.remove('active');
        modalVideo.pause(); multiVideos.forEach(v => v.pause());
    }
});