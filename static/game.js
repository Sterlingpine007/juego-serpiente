// Extremely simple Snake game (very small and clear)
document.addEventListener('DOMContentLoaded', function () {
    const c = document.getElementById('gameCanvas');
    const ctx = c.getContext('2d');
    if (!ctx) { alert('Canvas not supported'); return }
    const CELL = 20, COLS = c.width / CELL, ROWS = c.height / CELL;

    let snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
    let dir = { x: 1, y: 0 }, apple = null, score = 0, over = false;
    const scoreEl = document.getElementById('score');

    function rnd() { return { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) } }
    function placeApple() { let a; do { a = rnd() } while (snake.some(s => s.x === a.x && s.y === a.y)); apple = a }
    function reset() { snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }]; dir = { x: 1, y: 0 }; placeApple(); score = 0; over = false; if (scoreEl) scoreEl.textContent = '0' }

    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space' && over) { reset(); return }
        const M = { ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1], ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0] };
        if (!M[e.code]) return; const [nx, ny] = M[e.code];
        if (snake.length > 1 && snake[0].x + nx === snake[1].x && snake[0].y + ny === snake[1].y) return; dir = { x: nx, y: ny };
    });

    const controls = document.getElementById('controls');
    if (controls) controls.addEventListener('click', function (e) { const b = e.target.closest('button'); if (!b) return; const MAP = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }; const d = MAP[b.dataset.dir]; if (!d) return; if (snake.length > 1 && snake[0].x + d[0] === snake[1].x && snake[0].y + d[1] === snake[1].y) return; dir = { x: d[0], y: d[1] }; });

    function step() { if (over) return; const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }; if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) { over = true; return } snake.unshift(head); if (head.x === apple.x && head.y === apple.y) { score++; placeApple(); if (scoreEl) scoreEl.textContent = String(score) } else snake.pop(); }

    function draw() { ctx.fillStyle = '#063'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = '#f33'; ctx.fillRect(apple.x * CELL + 2, apple.y * CELL + 2, CELL - 4, CELL - 4); snake.forEach((s, i) => { ctx.fillStyle = i ? '#6c6' : '#ff9'; ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2) }); if (over) { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, c.height / 2 - 28, c.width, 56); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '18px Arial'; ctx.fillText('Game Over - Space to restart', c.width / 2, c.height / 2 + 6); ctx.textAlign = 'left' } }

    function loop() { step(); draw(); const delay = Math.max(60, 140 - score * 6); setTimeout(loop, delay); }

    reset(); draw(); loop();
});
