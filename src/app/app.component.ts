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

    //analyser.fftSize = 256

    const canvasCtx = this.visualizerRef.nativeElement.getContext('2d')
    //const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const WIDTH = this.visualizerRef.nativeElement.width
    const HEIGHT = this.visualizerRef.nativeElement.height

    const barWidth = 3 // WIDTH / bufferLength
    const barCount = 50
    const angle_step = Math.PI / barCount

    function renderFrame() {
      requestAnimationFrame(renderFrame)

      analyser.getByteFrequencyData(dataArray)

      canvasCtx!.fillStyle = '#121212'
      canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT)

      const centerX = WIDTH / 2
      const centerY = HEIGHT / 2

      const radius = 100

      //Circle
      canvasCtx!.strokeStyle = '#fff'
      canvasCtx!.lineWidth = barWidth
      canvasCtx!.beginPath()
      canvasCtx!.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      canvasCtx!.stroke()

      //Gradient
      const gradient = canvasCtx!.createConicGradient(
        1.5 * Math.PI,
        centerX,
        centerY,
      )
      gradient.addColorStop(0, 'red')
      gradient.addColorStop(1 / 7, 'orange')
      gradient.addColorStop(2 / 7, 'yellow')
      gradient.addColorStop(3 / 7, 'green')
      gradient.addColorStop(4 / 7, 'skyblue')
      gradient.addColorStop(5 / 7, 'blue')
      gradient.addColorStop(6 / 7, 'violet')
      gradient.addColorStop(1, 'red')

      //Bars
      for (let i = 0; i < barCount + 1; i++) {
        const barHeight = dataArray[i] * 0.4
        const anglePos = i * angle_step - Math.PI / 2
        const angleNeg = -i * angle_step - Math.PI / 2

        const xPos1 = centerX + (radius + barWidth) * Math.cos(anglePos)
        const yPos1 = centerY + (radius + barWidth) * Math.sin(anglePos)
        const xPos2 =
          centerX + Math.cos(anglePos) * (radius + barHeight + barWidth)
        const yPos2 =
          centerY + Math.sin(anglePos) * (radius + barHeight + barWidth)

        const xNeg1 = centerX + (radius + barWidth) * Math.cos(angleNeg)
        const yNeg1 = centerY + (radius + barWidth) * Math.sin(angleNeg)
        const xNeg2 =
          centerX + Math.cos(angleNeg) * (radius + barHeight + barWidth)
        const yNeg2 =
          centerY + Math.sin(angleNeg) * (radius + barHeight + barWidth)

        const barColor =
          'rgb(' + 200 + ', ' + (200 - dataArray[i]) + ', ' + dataArray[i] + ')'

        // canvasCtx!.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)'

        canvasCtx!.strokeStyle = gradient
        canvasCtx!.lineWidth = barWidth
        canvasCtx!.beginPath()
        canvasCtx!.moveTo(xPos1, yPos1)
        canvasCtx!.lineTo(xPos2, yPos2)
        canvasCtx!.moveTo(xNeg1, yNeg1)
        canvasCtx!.lineTo(xNeg2, yNeg2)
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
