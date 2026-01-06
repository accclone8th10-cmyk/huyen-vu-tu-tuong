const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Cập nhật thông số từ bộ nhớ của bạn
const CONFIG = {
    INFINITY_RADIUS: 13, // Bán kính vòng sáng tu luyện
    SPEED_MULTIPLIER: 3   // Tốc độ x3 như bạn đã thiết lập
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 40,
    linhKhi: 0,
    level: 0,
    angle: 0 // Dùng để xoay vòng sáng
};

const levels = [
    { name: "Luyện Khí", need: 100 },
    { name: "Trúc Cơ", need: 300 },
    { name: "Kim Đan", need: 800 },
    { name: "Nguyên Anh", need: 2000 }
];

// Cập nhật UI HTML
function updateUI() {
    const current = levels[player.level] || { name: "Đại Năng", need: 1 };
    document.getElementById("level-name").innerText = `Cảnh giới: ${current.name}`;
    document.getElementById("spirit-count").innerText = Math.floor(player.linhKhi);
    
    let percent = (player.linhKhi / current.need) * 100;
    document.getElementById("progress").style.width = Math.min(percent, 100) + "%";
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") tryBreakthrough();
});

function update(dt) {
    // Tăng linh khí theo multiplier x3
    player.linhKhi += dt * 20 * CONFIG.SPEED_MULTIPLIER;
    player.angle += dt * 2; // Xoay vòng sáng
    updateUI();
}

function tryBreakthrough() {
    const current = levels[player.level];
    if (current && player.linhKhi >= current.need) {
        player.linhKhi = 0;
        player.level++;
        // Thêm hiệu ứng rung màn hình nhẹ khi đột phá
        canvas.style.transform = "scale(1.05)";
        setTimeout(() => canvas.style.transform = "scale(1)", 100);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ vòng sáng tu luyện (Sử dụng INFINITY_RADIUS)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 242, 254, 0.5)";
    ctx.lineWidth = 2;
    ctx.arc(player.x, player.y, player.size + CONFIG.INFINITY_RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    // Vẽ nhân vật (Hình thoi cách điệu tu tiên)
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle / 2);
    ctx.fillStyle = "#4facfe";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2fe";
    ctx.fillRect(-player.size/2, -player.size/2, player.size, player.size);
    ctx.restore();
}

let lastTime = 0;
function loop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
