const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const hero = document.querySelector(".hero");

function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}
resizeCanvas();

let particles = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let mouseActive = false;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 2 + 1;
        this.speedX = 0;
        this.speedY = 0;
        this.color = `hsl(${210 + Math.random() * 15}, 80%, ${Math.random() * 25 + 40}%)`;
        this.friction = 0.88;
        this.springFactor = 0.02;
    }

    update() {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (mouseActive && distance < 120) {
            const force = (120 - distance) / 120;
            const angle = Math.atan2(dy, dx);
            this.speedX += Math.cos(angle) * force * 2.5;
            this.speedY += Math.sin(angle) * force * 2.5;
        }

        this.speedX *= this.friction;
        this.speedY *= this.friction;
        this.x += this.speedX;
        this.y += this.speedY;

        this.x += (this.originalX - this.x) * this.springFactor;
        this.y += (this.originalY - this.y) * this.springFactor;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles(count = 200) {
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    mouseActive = true;
});

hero.addEventListener("mouseleave", () => {
    mouseActive = false;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();

        particles.forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 80)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

initParticles();
animate();