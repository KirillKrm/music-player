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
  audio = new Audio()
  volume = 1

  playSound() {
    this.audio.src = '../assets/thepower.wav'
    this.audio.load()
    this.audio.play()
  }

  changeVolume(value: string) {
    this.volume = Number(value) / 100
    this.audio.volume = this.volume
  }
}
