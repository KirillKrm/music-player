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

  ngAfterViewInit() {
    const audioContext = new AudioContext()
    const audioSource = audioContext.createMediaElementSource(
      this.audioRef.nativeElement,
    )
    const analyser = audioContext.createAnalyser()

    audioSource.connect(analyser)
    audioSource.connect(audioContext.destination)

    const canvasCtx = this.visualizerRef.nativeElement.getContext('2d')
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const WIDTH = this.visualizerRef.nativeElement.width
    const HEIGHT = this.visualizerRef.nativeElement.height

    const barWidth = (WIDTH / bufferLength) * 2.5
    let barHeight
    let x = 0

    function renderFrame() {
      requestAnimationFrame(renderFrame)

      x = 0

      analyser.getByteFrequencyData(dataArray)

      canvasCtx!.fillStyle = '#000'
      canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT)

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]

        canvasCtx!.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)'
        canvasCtx!.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

        x += barWidth + 1
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
    if (isFinite(currentProgress)) progressRef.value = currentProgress
  }

  public onFileSelected(fileRef: HTMLInputElement) {
    if (fileRef.files) this.fileUrl = URL.createObjectURL(fileRef.files[0])
  }

  public draw() {}
}
