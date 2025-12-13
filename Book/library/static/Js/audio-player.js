/**
 * Audio Player JavaScript
 * Handles audio playback functionality for the listen page
 */

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');

    if (!audio || !playBtn) return;

    let isPlaying = false;

    // Play/Pause toggle
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            showPlayIcon();
        } else {
            audio.play();
            showPauseIcon();
        }
        isPlaying = !isPlaying;
    });

    // Update progress bar
    audio.addEventListener('timeupdate', function() {
        const currentTime = audio.currentTime;
        const duration = audio.duration;

        if (!isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = progressPercent + '%';

            currentTimeDisplay.textContent = formatTime(currentTime);
            durationDisplay.textContent = formatTime(duration);
        }
    });

    // Click on progress bar to seek
    progressBar.addEventListener('click', function(e) {
        const percent = e.offsetX / this.offsetWidth;
        audio.currentTime = percent * audio.duration;
        progress.style.width = (percent * 100) + '%';
    });

    // When audio ends
    audio.addEventListener('ended', function() {
        isPlaying = false;
        showPlayIcon();
        progress.style.width = '0%';
    });

    // Load metadata
    audio.addEventListener('loadedmetadata', function() {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    function showPlayIcon() {
        playBtn.querySelector('.play-icon').style.display = 'block';
        playBtn.querySelector('.pause-icon').style.display = 'none';
    }

    function showPauseIcon() {
        playBtn.querySelector('.play-icon').style.display = 'none';
        playBtn.querySelector('.pause-icon').style.display = 'block';
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return minutes + ':' + (secs < 10 ? '0' : '') + secs;
    }
});
