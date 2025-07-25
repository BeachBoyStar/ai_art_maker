document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const canvas = document.getElementById('artCanvas');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');
    const saveBtn = document.getElementById('saveBtn');

    // Controls
    const shapeCountSlider = document.getElementById('shapeCountSlider');
    const shapeCountValue = document.getElementById('shapeCountValue');
    const maxSizeSlider = document.getElementById('maxSizeSlider');
    const maxSizeValue = document.getElementById('maxSizeValue');
    const paletteSelector = document.getElementById('paletteSelector');
    const bgColorPicker = document.getElementById('bgColorPicker');

    // --- Color Palettes ---
    const palettes = {
        sunset: ['#f26b4d', '#f69352', '#f9c562', '#8cb8b7', '#5d85a1'],
        forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
        oceanic: ['#03045e', '#023e8a', '#0077b6', '#0096c7', '#48cae4'],
        monochrome: ['#000000', '#444444', '#888888', '#cccccc', '#ffffff'],
        random: [] // Special case handled in generateArt
    };

    // --- Utility Functions ---
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomColor = (palette) => palette[Math.floor(Math.random() * palette.length)];

    // --- Core Drawing Function ---
    function generateArt() {
        const shapeType = document.querySelector('input[name="shapeType"]:checked').value;
        const selectedPaletteName = paletteSelector.value;
        const bgColor = bgColorPicker.value;
        const count = shapeCountSlider.value;
        const maxSize = parseInt(maxSizeSlider.value);
        
        // Adjust canvas size dynamically
        const container = document.querySelector('.canvas-container');
        const size = Math.min(container.clientWidth, container.clientHeight);
        canvas.width = size;
        canvas.height = size;

        // 1. Draw Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Loop and Draw Shapes
        for (let i = 0; i < count; i++) {
            let color;
            if (selectedPaletteName === 'random') {
                color = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${Math.random() * 0.5 + 0.3})`;
            } else {
                color = getRandomColor(palettes[selectedPaletteName]);
            }
            
            ctx.fillStyle = color;
            ctx.strokeStyle = color;

            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            switch (shapeType) {
                case 'rectangles':
                    const width = getRandomInt(1, maxSize);
                    const height = getRandomInt(1, maxSize);
                    ctx.globalAlpha = Math.random() * 0.5 + 0.3; // Apply transparency
                    ctx.fillRect(x - width / 2, y - height / 2, width, height);
                    ctx.globalAlpha = 1.0; // Reset transparency
                    break;
                case 'circles':
                    const radius = getRandomInt(1, maxSize / 2);
                    ctx.globalAlpha = Math.random() * 0.5 + 0.3;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                    break;
                case 'lines':
                    const length = getRandomInt(10, maxSize * 1.5);
                    const angle = Math.random() * 2 * Math.PI;
                    ctx.lineWidth = getRandomInt(1, 5);
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
                    ctx.stroke();
                    break;
            }
        }
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Sliders update value display and regenerate art
        shapeCountSlider.addEventListener('input', () => {
            shapeCountValue.textContent = shapeCountSlider.value;
            generateArt();
        });
        maxSizeSlider.addEventListener('input', () => {
            maxSizeValue.textContent = maxSizeSlider.value;
            generateArt();
        });

        // Other controls just regenerate art on change
        document.querySelectorAll('input[name="shapeType"]').forEach(radio => {
            radio.addEventListener('change', generateArt);
        });
        paletteSelector.addEventListener('change', generateArt);
        bgColorPicker.addEventListener('input', generateArt);
        
        // Buttons
        generateBtn.addEventListener('click', generateArt);
        saveBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `artwork-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
        
        // Regenerate art if window is resized
        window.addEventListener('resize', generateArt);
    }

    // --- Initial Setup ---
    setupEventListeners();
    generateArt(); // Initial art generation on page load
});
