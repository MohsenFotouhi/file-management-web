import { Component, HostListener, ElementRef, Renderer2, ViewChild, EventEmitter, Output , Input} from '@angular/core';
import { NgIf, NgStyle } from "@angular/common";

@Component({
  selector: 'file-context-menu',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './file-context-menu.component.html',
  styleUrls: ['./file-context-menu.component.css'],
})


export class FileContextMenuComponent {

@Input() activeActionButtons  = false;  
@Input() item = '';

@Output() uploadlick =  new EventEmitter<string>();
@Output() downloadClick =  new EventEmitter<string>();
@Output() shareClick =  new EventEmitter<string>();
@Output() createFolderClick =  new EventEmitter<string>();
@Output() deleteClick =  new EventEmitter<string>();
@Output() renameClick =  new EventEmitter<string>();
@Output() cutClick =  new EventEmitter<string>();
@Output() copyClick =  new EventEmitter<string>();
@Output() reloadClick =  new EventEmitter<string>();
@Output() pasteClick =  new EventEmitter<string>();

  visible = false;
  x = 0;
  y = 0;


  constructor(private renderer: Renderer2) { }


  ShowFileMenu: boolean = false;
  ShowTreeMenu: boolean = false;
  showEmptyArea: boolean = false;

  show(event: MouseEvent, from: string) {
    event.preventDefault();
    this.visible = true;
    this.x = event.clientX - 100;
    this.y = event.clientY - 150;
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
    this.uploadlick.emit();
  }

  share() {
    this.shareClick.emit();
  }

  download() {
    this.downloadClick.emit();
  }

  delete() {
    this.deleteClick.emit();
  }

  rename() {
    this.renameClick.emit();
  }

  reload() {
    this.reloadClick.emit();
  }

  copy() {
    this.copyClick.emit();
  }

  cut() {
    this.cutClick.emit();
  }

  paste() {
    this.pasteClick.emit();
  }

  createFolder() {
    this.createFolderClick.emit();
  }

}
