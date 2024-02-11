import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  fileUrl = ''
  isPlay = false

  playSound(audioRef: HTMLAudioElement) {
    if (this.fileUrl) {
      if (this.isPlay) {
        audioRef.pause()
      } else {
        audioRef.play()
      }
      this.isPlay = !this.isPlay
    }
  }

  onChangeVolume(audioRef: HTMLAudioElement, volumeRef: HTMLInputElement) {
    audioRef.volume = Number(volumeRef.value) / 100
  }

  onUpdateProgress(
    audioRef: HTMLAudioElement,
    progressRef: HTMLProgressElement,
  ) {
    const currentProgress = audioRef.currentTime / audioRef.duration
    if (isFinite(currentProgress)) progressRef.value = currentProgress
  }

  onFileSelected(fileRef: HTMLInputElement) {
    if (fileRef.files) this.fileUrl = URL.createObjectURL(fileRef.files[0])
  }
}
