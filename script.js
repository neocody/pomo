class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        
        // Timer durations in minutes
        this.pomodoroTime = 25;
        this.shortBreakTime = 5;
        this.longBreakTime = 15;

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.pomodoroButton = document.getElementById('pomodoro');
        this.shortBreakButton = document.getElementById('shortBreak');
        this.longBreakButton = document.getElementById('longBreak');
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.pomodoroButton.addEventListener('click', () => this.setTimer(this.pomodoroTime));
        this.shortBreakButton.addEventListener('click', () => this.setTimer(this.shortBreakTime));
        this.longBreakButton.addEventListener('click', () => this.setTimer(this.longBreakTime));
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft === 0) {
                    this.pause();
                    this.alert();
                }
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.timeLeft = this.pomodoroTime * 60;
        this.updateDisplay();
    }

    setTimer(minutes) {
        this.pause();
        this.timeLeft = minutes * 60;
        this.updateDisplay();
        
        // Update active button
        [this.pomodoroButton, this.shortBreakButton, this.longBreakButton].forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    alert() {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
        alert('Timer finished!');
    }
}

class SoundManager {
    constructor() {
        // Updated file paths to be relative to the project root
        this.sounds = {
            rain: new Audio('./sounds/rain.wav'),
            waves: new Audio('./sounds/waves.wav'),
        };
        
        this.currentSound = null;
        this.volume = 0.5;
        
        // Add error handling for audio loading
        Object.values(this.sounds).forEach(sound => {
            sound.loop = true;
            sound.addEventListener('error', (e) => {
                console.error('Error loading sound:', e);
            });
        });
        
        this.setupSoundControls();
    }
    
    setupSoundControls() {
        const soundControls = document.createElement('div');
        soundControls.className = 'sound-controls';
        
        soundControls.innerHTML = `
            <h3>Background Sounds</h3>
            <div class="sound-buttons">
                <button class="sound-button" data-sound="rain">🌧️ Rain</button>
                <button class="sound-button" data-sound="waves">🌊 Waves</button>
            </div>
            <input type="range" class="volume-control" min="0" max="1" step="0.1" value="0.5">
        `;
        
        document.body.appendChild(soundControls);
        
        // Add event listeners with console logging for debugging
        const buttons = soundControls.querySelectorAll('.sound-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const soundName = button.dataset.sound;
                console.log('Sound button clicked:', soundName);
                this.toggleSound(soundName, button);
            });
        });
        
        const volumeControl = soundControls.querySelector('.volume-control');
        volumeControl.addEventListener('input', (e) => {
            this.volume = e.target.value;
            console.log('Volume changed:', this.volume);
            if (this.currentSound) {
                this.currentSound.volume = this.volume;
            }
        });
    }
    
    toggleSound(soundName, button) {
        console.log('Toggling sound:', soundName);
        
        // Stop current sound if playing
        if (this.currentSound) {
            this.currentSound.pause();
            this.currentSound.currentTime = 0;
            document.querySelectorAll('.sound-button').forEach(btn => btn.classList.remove('active'));
        }
        
        // If clicking the same sound that's playing, just stop it
        if (this.currentSound === this.sounds[soundName]) {
            this.currentSound = null;
            return;
        }
        
        // Play new sound
        this.currentSound = this.sounds[soundName];
        this.currentSound.volume = this.volume;
        
        // Add error handling for play attempt
        try {
            const playPromise = this.currentSound.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Sound playing successfully');
                    button.classList.add('active');
                }).catch(error => {
                    console.error('Error playing sound:', error);
                });
            }
        } catch (error) {
            console.error('Error attempting to play sound:', error);
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
    const soundManager = new SoundManager();
}); 