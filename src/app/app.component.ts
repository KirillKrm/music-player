import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('audioRef') audioRef!: ElementRef<HTMLMediaElement>
  @ViewChild('visualizerRef') visualizerRef!: ElementRef<HTMLCanvasElement>

  public fileUrl = ''
  public isPlay = false
  public currentTime = '0:00'
  public duration = '-:-'

  ngAfterViewInit() {
    const audioContext = new AudioContext()
    const audioSource = audioContext.createMediaElementSource(
      this.audioRef.nativeElement,
    )
    const analyser = audioContext.createAnalyser()

    audioSource.connect(audioContext.destination)
    audioSource.connect(analyser)

    analyser.fftSize = 256

    const canvasCtx = this.visualizerRef.nativeElement.getContext('2d')
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const WIDTH = this.visualizerRef.nativeElement.width
    const HEIGHT = this.visualizerRef.nativeElement.height

    const barWidth = WIDTH / bufferLength
    const angle_step = (Math.PI * 2) / bufferLength

    function renderFrame() {
      requestAnimationFrame(renderFrame)

      analyser.getByteFrequencyData(dataArray)

      canvasCtx!.fillStyle = '#121212'
      canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT)

      const centerX = WIDTH / 2
      const centerY = HEIGHT / 2

      const radius = 20

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 0.5
        const angle = i * angle_step

        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        const xEnd = centerX + Math.cos(angle) * (radius + barHeight)
        const yEnd = centerY + Math.sin(angle) * (radius + barHeight)

        // canvasCtx!.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)'

        canvasCtx!.strokeStyle = '#ffffff'
        canvasCtx!.lineWidth = barWidth
        canvasCtx!.beginPath()
        canvasCtx!.moveTo(x, y)
        canvasCtx!.lineTo(xEnd, yEnd)
        canvasCtx!.stroke()
      }
    }

    renderFrame()
  }

  public playSound(audioRef: HTMLAudioElement) {
    if (this.fileUrl) {
      if (this.isPlay) {
        audioRef.pause()
      } else {
        audioRef.play()
      }
      this.isPlay = !this.isPlay
    }
  }

  public onChangeVolume(
    audioRef: HTMLAudioElement,
    volumeRef: HTMLInputElement,
  ) {
    audioRef.volume = Number(volumeRef.value) / 100
  }

  public onUpdateProgress(
    audioRef: HTMLAudioElement,
    progressRef: HTMLProgressElement,
  ) {
    const currentProgress = audioRef.currentTime / audioRef.duration
    const currentMinutes = Math.floor(audioRef.currentTime / 60)
    const currentSeconds = Math.floor(audioRef.currentTime % 60)
    const durationMinutes = Math.floor(audioRef.duration / 60)
    const durationSeconds = Math.floor(audioRef.duration % 60)

    isFinite(currentProgress) ? (progressRef.value = currentProgress) : 0

    this.currentTime = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`

    this.duration = isFinite(audioRef.duration)
      ? `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`
      : '-:-'
  }

  public onFileSelected(fileRef: HTMLInputElement) {
    if (fileRef.files) this.fileUrl = URL.createObjectURL(fileRef.files[0])
  }
}
