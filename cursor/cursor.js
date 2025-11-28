export function initCursor() {
    const cursor = document.getElementById('cursor');
    const cursorPt = document.getElementById('cursorPt');
    const cornerWrapper = document.getElementById('cornerWrapper');

    let mouseX = 0, mouseY = 0;
    let boxX = 0, boxY = 0;
    let sizeX = 10, sizeY = 10;
    let targetX = 0, targetY = 0;
    let targetSizeX = 30, targetSizeY = 30;
    let hoverElement = null;
    let idleRotation = 0;

    function lerp(a, b, n) { return (1 - n) * a + n * b; }

    function animate() {
        cursor.style.top = `${mouseY}px`;
        cursor.style.left = `${mouseX}px`;

        boxX = lerp(boxX, hoverElement ? targetX : mouseX, 0.12);
        boxY = lerp(boxY, hoverElement ? targetY : mouseY, 0.12);
        sizeX = lerp(sizeX, targetSizeX, 0.12);
        sizeY = lerp(sizeY, targetSizeY, 0.12);

        cursorPt.style.top = `${boxY}px`;
        cursorPt.style.left = `${boxX}px`;
        cursorPt.style.width = `${sizeX}px`;
        cursorPt.style.height = `${sizeY}px`;

        if (!hoverElement) idleRotation += 0.5;
        else idleRotation = 0;

        cornerWrapper.style.transform = `rotate(${idleRotation}deg)`;

        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!hoverElement) {
            targetX = mouseX;
            targetY = mouseY;
            targetSizeX = 30;
            targetSizeY = 30;
        }
    });

    const targets = document.querySelectorAll('.hover-target');

    targets.forEach(el => {
        el.addEventListener("click", () => {
            const clickSound = new Audio("./cursor/sfx/click.wav");
            clickSound.volume = 0.20;
            clickSound.play().catch(() => {});
        });

        el.addEventListener("mousemove", e => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - (rect.left + rect.width / 2);
            const relY = e.clientY - (rect.top + rect.height / 2);
            const strength = 0.15;

            targetX = rect.left + rect.width / 2 + relX * strength;
            targetY = rect.top + rect.height / 2 + relY * strength;
        });

        el.addEventListener("mouseleave", () => {
            targetX = mouseX;
            targetY = mouseY;
        });

        el.addEventListener('mouseenter', () => {
            const hoverSound = new Audio("./cursor/sfx/hover.wav");
            hoverSound.volume = 0.3;
            hoverSound.play().catch(() => {});

            hoverElement = el;

            const rect = el.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;

            const customColor = el.dataset.cursorColor || null;
            if (customColor) {
                cursorPt.style.borderColor = customColor;
                cursor.style.backgroundColor = customColor;
            } else {
                cursorPt.style.borderColor = "";
                cursor.style.backgroundColor = "";
            }

            targetSizeX = rect.width + 8;
            targetSizeY = rect.height + 8;
        });

        el.addEventListener('mouseleave', () => {
            hoverElement = null;
            cursorPt.style.borderColor = "";
            cursor.style.backgroundColor = "";
            targetSizeX = 30;
            targetSizeY = 30;
            targetX = mouseX;
            targetY = mouseY;
        });
    });
}