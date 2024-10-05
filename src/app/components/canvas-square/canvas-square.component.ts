import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas-square',
  templateUrl: './canvas-square.component.html',
  styleUrls: ['./canvas-square.component.scss']
})
export class CanvasSquareComponent
{
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private startX: number = 0;
  private startY: number = 0;
  private isDrawing: boolean = false;

  ngAfterViewInit(): void
  {
    const canvas = this.canvasElement.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.canvas.width = canvas.offsetWidth;
    this.ctx.canvas.height = canvas.offsetHeight;
    // Optional: Set the initial fill style for better visibility
    this.ctx.fillStyle = "#FFF";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  startDrawing(event: MouseEvent): void
  {
    const currentX = event.offsetX;
    const currentY = event.offsetY;
    this.ctx.clearRect(0, 0, 200, 200);
    this.ctx.beginPath();
    this.ctx.fillStyle = "skyblue";
    this.ctx.strokeStyle = "gray";
    this.ctx.rect(currentX, currentY, 30, 20);
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawSquare(event: MouseEvent): void
  {
    if (!this.isDrawing) return;
    console.log('is drawind');

    // Clear the previous square
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Calculate the square dimensions
    const currentX = event.offsetX;
    const currentY = event.offsetY;
    const width = currentX - this.startX;
    const height = currentY - this.startY;

    // Draw the square from startX, startY
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.startX, this.startY, width, height);
  }

  endDrawing(event: MouseEvent): void
  {
    console.log('end drawing');
    this.isDrawing = false;
  }
}
