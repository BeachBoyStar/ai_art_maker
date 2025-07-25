document.addEventListener('DOMContentLoaded', () => {


    const canvas = document.getElementById('artCanvas');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');

    canvas.width = 600;
    canvas.height = 600;


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateArt() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const numberOfRects = 200;
        for (let i = 0; i < numberOfRects; i++) {

            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;

            const width = getRandomInt(10, 100);
            const height = getRandomInt(10,100);

            const red = getRandomInt(0, 255);
            const green = getRandomInt(0, 255);
            const blue = getRandomInt(0, 255);
            const alpha = Math.random() * 0.5 + 0.2;

            ctx.fillStyle = `rgba(${red}, $(green}, ${blue}, ${alpha})`;
        
        ctx.fillRect(x, y, width, height);
    }
}

generateBtn.addEventListener('click', generateArt);

generateArt();

});

