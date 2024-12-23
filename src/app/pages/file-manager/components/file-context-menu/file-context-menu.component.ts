import { NgIf, NgStyle } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: 'file-context-menu',
  standalone: true,
  imports: [NgStyle, NgIf, MatDividerModule],
  templateUrl: './file-context-menu.component.html',
  styleUrls: ['./file-context-menu.component.scss'],
})


export class FileContextMenuComponent
{

  @Input() activeActionButtons = false;
  @Input() item = '';
  @Input() isSharedFile = false;

  @Output() uploadlick = new EventEmitter<string>();
  @Output() downloadClick = new EventEmitter<string>();
  @Output() shareClick = new EventEmitter<string>();
  @Output() createFolderClick = new EventEmitter<string>();
  @Output() deleteClick = new EventEmitter<string>();
  @Output() renameClick = new EventEmitter<string>();
  @Output() cutClick = new EventEmitter<string>();
  @Output() copyClick = new EventEmitter<string>();
  @Output() reloadClick = new EventEmitter<string>();
  @Output() pasteClick = new EventEmitter<string>();

  visible = false;
  x = 0;
  y = 0;


  constructor(private renderer: Renderer2) { }


  ShowFileMenu: boolean = false;
  ShowTreeMenu: boolean = false;
  showEmptyArea: boolean = false;

  show(event: MouseEvent, from: string)
  {
    event.preventDefault();
    // Calculate the height and width of the window
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    // Determine whether the click is on the top or bottom half of the screen
    const isTopHalf = event.clientY < windowHeight / 2;
    const isRightHalf = event.clientX < windowWidth / 2;
    // Set the context menu position based on click location
    // this.x = event.clientX - 100;
    const ySpace = isTopHalf ? 0 : 164; // Adjust position based on click location
    const xSpace = isRightHalf ? 12 : 160; // Adjust position based on click location
    console.log('xSpace', xSpace, 'event.clientX', event.clientX, 'isRightHalf', isRightHalf);

    this.x = event.clientX - 0 - xSpace;
    this.y = event.clientY - 67 - ySpace; // Adjust position based on click location


    this.visible = true;
    this.ShowFileMenu = from === "file";
    this.ShowTreeMenu = from === "tree";
    this.showEmptyArea = from === "emptyArea";
  }

  hide()
  {
    this.visible = false;
  }

  @HostListener('document:click')
  onDocumentClick()
  {
    this.hide();
  }


  upload()
  {
    this.uploadlick.emit();
  }

  share()
  {
    this.shareClick.emit();
  }

  download()
  {
    this.downloadClick.emit();
  }

  delete()
  {
    this.deleteClick.emit();
  }

  rename()
  {
    this.renameClick.emit();
  }

  reload()
  {
    this.reloadClick.emit();
  }

  copy()
  {
    this.copyClick.emit();
  }

  cut()
  {
    this.cutClick.emit();
  }

  paste()
  {
    this.pasteClick.emit();
  }

  createFolder()
  {
    this.createFolderClick.emit();
  }

}
