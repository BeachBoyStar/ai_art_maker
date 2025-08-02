class QuantumParticleDance {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.gameMessages = document.getElementById('gameMessages');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused
        this.score = 0;
        this.level = 1;
        this.energy = 100;
        this.harmony = 0;
        
        // Canvas setup
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Player (Quantum Field)
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: 30,
            velocity: { x: 0, y: 0 },
            maxSpeed: 8,
            friction: 0.95
        };
        
        // Particles
        this.particles = [];
        this.maxParticles = 200;
        this.particleEmissionRate = 0;
        this.particleEmissionCooldown = 0;
        
        // Quantum resonators (targets)
        this.resonators = [];
        this.resonatorSpawnTimer = 0;
        
        // Visual effects
        this.trails = [];
        this.glowEffects = [];
        this.backgroundParticles = [];
        
        // Input handling
        this.keys = {};
        this.setupInputHandling();
        
        // UI elements
        this.setupUI();
        
        // Start background effects
        this.initBackgroundEffects();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupInputHandling() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space' && this.gameState === 'playing') {
                e.preventDefault();
                this.emitParticles();
            }
            
            if (e.code === 'ShiftLeft' && this.gameState === 'playing') {
                this.quantumShift();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('tutorialBtn').addEventListener('click', () => {
            this.showTutorial();
        });
        
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });
    }
    
    setupUI() {
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.particleCountElement = document.getElementById('particleCount');
        this.energyBar = document.getElementById('energyBar');
        this.harmonyBar = document.getElementById('harmonyBar');
    }
    
    initBackgroundEffects() {
        // Create background particles
        for (let i = 0; i < 50; i++) {
            this.backgroundParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2
            });
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.menuOverlay.classList.add('hidden');
        this.score = 0;
        this.level = 1;
        this.energy = 100;
        this.harmony = 0;
        this.particles = [];
        this.resonators = [];
        this.trails = [];
        this.glowEffects = [];
        
        this.showMessage('Quantum field activated!', 'success');
        this.spawnResonators();
    }
    
    showTutorial() {
        this.showMessage('Use WASD to move, SPACE to emit particles, SHIFT for quantum shift!', 'info');
    }
    
    showSettings() {
        this.showMessage('Settings coming soon!', 'info');
    }
    
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        this.gameMessages.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    emitParticles() {
        if (this.particleEmissionCooldown > 0) return;
        
        const particleCount = 5 + Math.floor(this.level / 2);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 3 + Math.random() * 2;
            
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                },
                size: Math.random() * 4 + 2,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.01,
                color: this.getParticleColor(),
                trail: []
            });
        }
        
        this.particleEmissionCooldown = 10;
        this.energy = Math.max(0, this.energy - 2);
    }
    
    quantumShift() {
        if (this.energy < 20) return;
        
        // Teleport player to a random location
        this.player.x = Math.random() * this.canvas.width;
        this.player.y = Math.random() * this.canvas.height;
        
        // Create quantum shift effect
        for (let i = 0; i < 20; i++) {
            this.glowEffects.push({
                x: this.player.x + (Math.random() - 0.5) * 100,
                y: this.player.y + (Math.random() - 0.5) * 100,
                size: Math.random() * 30 + 10,
                life: 1.0,
                decay: 0.05,
                color: '#4ecdc4'
            });
        }
        
        this.energy = Math.max(0, this.energy - 20);
        this.showMessage('Quantum shift activated!', 'success');
    }
    
    getParticleColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    spawnResonators() {
        const count = 3 + Math.floor(this.level / 3);
        for (let i = 0; i < count; i++) {
            this.resonators.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                size: 40 + Math.random() * 20,
                targetSize: 40 + Math.random() * 20,
                resonance: 0,
                maxResonance: 100,
                color: this.getParticleColor(),
                pulse: 0
            });
        }
    }
    
    updatePlayer() {
        // Handle input
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.player.velocity.y -= 0.5;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.player.velocity.y += 0.5;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.velocity.x -= 0.5;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.velocity.x += 0.5;
        }
        
        // Apply velocity limits and friction
        this.player.velocity.x = Math.max(-this.player.maxSpeed, Math.min(this.player.maxSpeed, this.player.velocity.x));
        this.player.velocity.y = Math.max(-this.player.maxSpeed, Math.min(this.player.maxSpeed, this.player.velocity.y));
        
        this.player.velocity.x *= this.player.friction;
        this.player.velocity.y *= this.player.friction;
        
        // Update position
        this.player.x += this.player.velocity.x;
        this.player.y += this.player.velocity.y;
        
        // Keep player in bounds
        this.player.x = Math.max(this.player.size, Math.min(this.canvas.width - this.player.size, this.player.x));
        this.player.y = Math.max(this.player.size, Math.min(this.canvas.height - this.player.size, this.player.y));
        
        // Add trail effect
        this.trails.push({
            x: this.player.x,
            y: this.player.y,
            life: 1.0,
            decay: 0.02
        });
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            
            // Add to trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 10) {
                particle.trail.shift();
            }
            
            // Update life
            particle.life -= particle.decay;
            
            // Check bounds
            if (particle.x < 0 || particle.x > this.canvas.width || 
                particle.y < 0 || particle.y > this.canvas.height) {
                particle.life = 0;
            }
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update emission cooldown
        if (this.particleEmissionCooldown > 0) {
            this.particleEmissionCooldown--;
        }
    }
    
    updateResonators() {
        for (const resonator of this.resonators) {
            resonator.pulse += 0.1;
            
            // Check particle collisions
            for (const particle of this.particles) {
                const distance = Math.sqrt(
                    Math.pow(particle.x - resonator.x, 2) + 
                    Math.pow(particle.y - resonator.y, 2)
                );
                
                if (distance < resonator.size / 2) {
                    resonator.resonance += 2;
                    particle.life = 0;
                    
                    // Create resonance effect
                    this.glowEffects.push({
                        x: resonator.x,
                        y: resonator.y,
                        size: resonator.size,
                        life: 1.0,
                        decay: 0.03,
                        color: resonator.color
                    });
                }
            }
            
            // Check if resonator is fully charged
            if (resonator.resonance >= resonator.maxResonance) {
                this.score += 100 * this.level;
                this.harmony = Math.min(100, this.harmony + 10);
                this.showMessage('Resonance achieved!', 'success');
            }
        }
        
        // Check level completion
        const completedResonators = this.resonators.filter(r => r.resonance >= r.maxResonance);
        if (completedResonators.length === this.resonators.length) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.resonators = [];
        this.spawnResonators();
        this.energy = Math.min(100, this.energy + 30);
        this.showMessage(`Level ${this.level} reached!`, 'success');
    }
    
    updateEffects() {
        // Update trails
        for (let i = this.trails.length - 1; i >= 0; i--) {
            this.trails[i].life -= this.trails[i].decay;
            if (this.trails[i].life <= 0) {
                this.trails.splice(i, 1);
            }
        }
        
        // Update glow effects
        for (let i = this.glowEffects.length - 1; i >= 0; i--) {
            this.glowEffects[i].life -= this.glowEffects[i].decay;
            if (this.glowEffects[i].life <= 0) {
                this.glowEffects.splice(i, 1);
            }
        }
        
        // Update background particles
        for (const particle of this.backgroundParticles) {
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.particleCountElement.textContent = this.particles.length;
        
        // Update energy bar
        this.energyBar.style.setProperty('--energy-width', `${this.energy}%`);
        this.energyBar.querySelector('::before').style.width = `${this.energy}%`;
        
        // Update harmony bar
        this.harmonyBar.style.setProperty('--harmony-width', `${this.harmony}%`);
        this.harmonyBar.querySelector('::before').style.width = `${this.harmony}%`;
        
        // Regenerate energy slowly
        if (this.gameState === 'playing') {
            this.energy = Math.min(100, this.energy + 0.1);
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render background particles
        this.renderBackgroundParticles();
        
        // Render trails
        this.renderTrails();
        
        // Render glow effects
        this.renderGlowEffects();
        
        // Render resonators
        this.renderResonators();
        
        // Render particles
        this.renderParticles();
        
        // Render player
        this.renderPlayer();
    }
    
    renderBackgroundParticles() {
        this.ctx.save();
        for (const particle of this.backgroundParticles) {
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    renderTrails() {
        this.ctx.save();
        for (const trail of this.trails) {
            this.ctx.globalAlpha = trail.life * 0.3;
            this.ctx.fillStyle = '#4ecdc4';
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    renderGlowEffects() {
        this.ctx.save();
        for (const effect of this.glowEffects) {
            const gradient = this.ctx.createRadialGradient(
                effect.x, effect.y, 0,
                effect.x, effect.y, effect.size
            );
            gradient.addColorStop(0, `${effect.color}${Math.floor(effect.life * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    renderResonators() {
        for (const resonator of this.resonators) {
            // Draw resonator body
            this.ctx.save();
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = resonator.color;
            this.ctx.beginPath();
            this.ctx.arc(resonator.x, resonator.y, resonator.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw resonance progress
            const progress = resonator.resonance / resonator.maxResonance;
            this.ctx.globalAlpha = 0.6;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(resonator.x, resonator.y, (resonator.size / 2) * progress, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw pulse effect
            this.ctx.globalAlpha = 0.3 * Math.sin(resonator.pulse);
            this.ctx.strokeStyle = resonator.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(resonator.x, resonator.y, resonator.size / 2 + 10, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
    }
    
    renderParticles() {
        for (const particle of this.particles) {
            // Draw particle trail
            this.ctx.save();
            for (let i = 0; i < particle.trail.length; i++) {
                const trailPoint = particle.trail[i];
                const alpha = (i / particle.trail.length) * particle.life * 0.5;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(trailPoint.x, trailPoint.y, particle.size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Draw particle
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    renderPlayer() {
        // Draw player glow
        this.ctx.save();
        const gradient = this.ctx.createRadialGradient(
            this.player.x, this.player.y, 0,
            this.player.x, this.player.y, this.player.size * 2
        );
        gradient.addColorStop(0, 'rgba(78, 205, 196, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw player core
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw player border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.gameState === 'playing') {
            this.updatePlayer();
            this.updateParticles();
            this.updateResonators();
            this.updateEffects();
            this.updateUI();
        }
        
        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuantumParticleDance();
});
