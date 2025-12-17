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
    const totalDurationDisplay = document.getElementById('totalDuration');

    // Control buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const shareBtn = document.getElementById('shareBtn');
    // Note: likeBtn is now an anchor tag, no JS reference needed

    // Playlist elements
    const playlistBtn = document.getElementById('playlistBtn');
    const playlistMenu = document.getElementById('playlistMenu');
    const playlistOverlay = document.getElementById('playlistOverlay');
    const closePlaylist = document.getElementById('closePlaylist');
    const playlistItems = document.getElementById('playlistItems');

    // Volume elements
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeLevel = document.getElementById('volumeLevel');
    const volumeIcon = document.getElementById('volumeIcon');

    // Speed buttons
    const speedBtns = document.querySelectorAll('.speed-btn');

    if (!audio || !playBtn) return;

    let isPlaying = false;
    let isRepeat = false;
    let isShuffle = false;
    let isMuted = false;
    let previousVolume = 1;
    let currentPlaylistIndex = 0;

    // Get all playlist items as an array
    function getPlaylistArray() {
        if (!playlistItems) return [];
        return Array.from(playlistItems.querySelectorAll('li'));
    }

    // ==================== PLAY/PAUSE ====================
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

    // ==================== PROGRESS BAR ====================
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

    progressBar.addEventListener('click', function(e) {
        const percent = e.offsetX / this.offsetWidth;
        audio.currentTime = percent * audio.duration;
        progress.style.width = (percent * 100) + '%';
    });

    // ==================== AUDIO ENDED ====================
    audio.addEventListener('ended', function() {
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            const items = getPlaylistArray();
            if (isShuffle && items.length > 1) {
                // Play random track
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * items.length);
                } while (randomIndex === currentPlaylistIndex && items.length > 1);
                playTrack(randomIndex);
            } else if (currentPlaylistIndex < items.length - 1) {
                // Play next track
                playTrack(currentPlaylistIndex + 1);
            } else {
                // End of playlist
                isPlaying = false;
                showPlayIcon();
                progress.style.width = '0%';
            }
        }
    });

    // ==================== METADATA LOADED ====================
    audio.addEventListener('loadedmetadata', function() {
        const duration = formatTime(audio.duration);
        durationDisplay.textContent = duration;
        if (totalDurationDisplay) {
            totalDurationDisplay.textContent = duration;
        }
    });

    // ==================== PREVIOUS/NEXT BUTTONS ====================
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const items = getPlaylistArray();
            if (items.length === 0) {
                // No playlist, just restart current track
                audio.currentTime = 0;
            } else if (audio.currentTime > 3) {
                // If more than 3 seconds in, restart current track
                audio.currentTime = 0;
            } else if (currentPlaylistIndex > 0) {
                playTrack(currentPlaylistIndex - 1);
            } else {
                audio.currentTime = 0;
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const items = getPlaylistArray();
            if (isShuffle && items.length > 1) {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * items.length);
                } while (randomIndex === currentPlaylistIndex);
                playTrack(randomIndex);
            } else if (currentPlaylistIndex < items.length - 1) {
                playTrack(currentPlaylistIndex + 1);
            }
        });
    }

    // ==================== SHUFFLE BUTTON ====================
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            isShuffle = !isShuffle;
            this.classList.toggle('active', isShuffle);
        });
    }

    // ==================== REPEAT BUTTON ====================
    if (repeatBtn) {
        repeatBtn.addEventListener('click', function() {
            isRepeat = !isRepeat;
            this.classList.toggle('active', isRepeat);
        });
    }

    // ==================== LIKE BUTTON ====================
    // Like button is now an anchor tag that redirects to add_favorite or login
    // No JavaScript handler needed

    // ==================== SHARE BUTTON ====================
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(function() {
                    alert('تم نسخ الرابط!');
                });
            }
        });
    }

    // ==================== PLAYLIST MENU ====================
    if (playlistBtn && playlistMenu && playlistOverlay) {
        playlistBtn.addEventListener('click', function() {
            playlistMenu.style.display = 'block';
            playlistOverlay.style.display = 'block';
        });

        closePlaylist.addEventListener('click', closePlaylistMenu);
        playlistOverlay.addEventListener('click', closePlaylistMenu);

        function closePlaylistMenu() {
            playlistMenu.style.display = 'none';
            playlistOverlay.style.display = 'none';
        }

        // Playlist item click
        if (playlistItems) {
            playlistItems.addEventListener('click', function(e) {
                const item = e.target.closest('li');
                if (item) {
                    const items = getPlaylistArray();
                    const index = items.indexOf(item);
                    if (index !== -1) {
                        playTrack(index);
                        closePlaylistMenu();
                    }
                }
            });
        }
    }

    // ==================== VOLUME CONTROL ====================
    if (volumeBtn && volumeSlider && volumeLevel) {
        // Set initial volume
        audio.volume = 1;
        volumeLevel.style.width = '100%';

        volumeBtn.addEventListener('click', function() {
            isMuted = !isMuted;
            if (isMuted) {
                previousVolume = audio.volume;
                audio.volume = 0;
                volumeLevel.style.width = '0%';
                updateVolumeIcon(0);
            } else {
                audio.volume = previousVolume;
                volumeLevel.style.width = (previousVolume * 100) + '%';
                updateVolumeIcon(previousVolume);
            }
        });

        volumeSlider.addEventListener('click', function(e) {
            const percent = e.offsetX / this.offsetWidth;
            audio.volume = Math.max(0, Math.min(1, percent));
            volumeLevel.style.width = (audio.volume * 100) + '%';
            isMuted = audio.volume === 0;
            updateVolumeIcon(audio.volume);
        });
    }

    function updateVolumeIcon(volume) {
        if (!volumeIcon) return;
        if (volume === 0) {
            volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        } else if (volume < 0.5) {
            volumeIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
        } else {
            volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        }
    }

    // ==================== SPEED CONTROL ====================
    speedBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const speed = parseFloat(this.getAttribute('data-speed'));
            audio.playbackRate = speed;
            speedBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ==================== PLAY TRACK FUNCTION ====================
    function playTrack(index) {
        const items = getPlaylistArray();
        if (index < 0 || index >= items.length) return;

        // Update active state
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // Get audio source
        const item = items[index];
        const src = item.getAttribute('data-src');
        if (src) {
            audio.src = src;
            audio.play();
            isPlaying = true;
            showPauseIcon();
            currentPlaylistIndex = index;
        }
    }

    // ==================== HELPER FUNCTIONS ====================
    function showPlayIcon() {
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
    }

    function showPauseIcon() {
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs;
        }
        return minutes + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // ==================== KEYBOARD SHORTCUTS ====================
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                playBtn.click();
                break;
            case 'ArrowLeft':
                audio.currentTime = Math.max(0, audio.currentTime - 10);
                break;
            case 'ArrowRight':
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                audio.volume = Math.min(1, audio.volume + 0.1);
                if (volumeLevel) volumeLevel.style.width = (audio.volume * 100) + '%';
                updateVolumeIcon(audio.volume);
                break;
            case 'ArrowDown':
                e.preventDefault();
                audio.volume = Math.max(0, audio.volume - 0.1);
                if (volumeLevel) volumeLevel.style.width = (audio.volume * 100) + '%';
                updateVolumeIcon(audio.volume);
                break;
            case 'KeyM':
                if (volumeBtn) volumeBtn.click();
                break;
        }
    });
});
