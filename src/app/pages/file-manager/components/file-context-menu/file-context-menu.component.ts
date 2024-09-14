import { Component, HostListener, ElementRef, Renderer2, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgIf, NgStyle } from "@angular/common";

@Component({
  selector: 'file-context-menu',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './file-context-menu.component.html',
  styleUrls: ['./file-context-menu.component.css'],
})


export class FileContextMenuComponent {

  visible = false;
  x = 0;
  y = 0;


  @Output()
  menuClicked = new EventEmitter<string>();

  constructor(private renderer: Renderer2) { }


  ShowFileMenu: boolean = false;
  ShowTreeMenu: boolean = false;
  showEmptyArea: boolean = false;

  show(event: MouseEvent, from: string) {
    event.preventDefault();
    this.visible = true;
    this.x = event.clientX;
    this.y = event.clientY;
    this.ShowFileMenu = from == "file";
    this.ShowTreeMenu = from == "tree";
    this.showEmptyArea = from == "emptyArea";
  }

  hide() {
    this.visible = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.hide();
  }


  upload() {
    this.menuClicked.emit("upload");
  }

  share() {
    this.menuClicked.emit("share");
  }

  download() {
    this.menuClicked.emit("download");
  }

  delete() {
    this.menuClicked.emit("delete");
  }

  rename(event : any) {
    this.menuClicked.emit("rename");
  }

  reload() {
    this.menuClicked.emit("reload");
  }

  copy() {
    this.menuClicked.emit("copy");
  }

  cut() {
    this.menuClicked.emit("cut");
  }

  paste() {
    this.menuClicked.emit("paste");
  }

  createFolder() {
    this.menuClicked.emit("createFolder");
  }


}
