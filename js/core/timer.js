// Timer management
export class Timer {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.interval = null;
        this.onTick = null;
    }

    start(onTick = null) {
        this.startTime = Date.now() - this.elapsedTime;
        this.onTick = onTick;
        
        this.interval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            if (this.onTick) {
                this.onTick(this.getFormattedTime());
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.startTime = null;
    }

    getFormattedTime() {
        const seconds = Math.floor(this.elapsedTime / 1000);
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    getElapsedSeconds() {
        return Math.floor(this.elapsedTime / 1000);
    }
}
