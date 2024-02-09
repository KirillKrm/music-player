import { Component, ViewChild } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isPlay = false

  playSound(audioRef: HTMLAudioElement) {
    if (this.isPlay) {
      audioRef.pause()
    } else {
      audioRef.play()
    }

    this.isPlay = !this.isPlay
  }

  changeVolume(audioRef: HTMLAudioElement, volumeRef: HTMLInputElement) {
    audioRef.volume = Number(volumeRef.value) / 100
  }

  updateProgress(audioRef: HTMLAudioElement, progressRef: HTMLProgressElement) {
    progressRef.value = audioRef.currentTime / audioRef.duration
  }
}
