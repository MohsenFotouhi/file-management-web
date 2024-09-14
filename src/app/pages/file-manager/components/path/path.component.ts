import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FilePath } from './file-path';

@Component({
  selector: 'app-path',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './path.component.html',
  styleUrl: './path.component.css'
})
export class PathComponent {


  @Input()
  rootPath: FilePath = new FilePath();

  @Output()
  currentPathChanged = new EventEmitter<FilePath>();

  @Output()
  currentChildPathChanged = new EventEmitter<FilePath>();

  @Output()
   rightClickNodeChanged = new EventEmitter< [MouseEvent, FilePath]>()

  constructor() {
  }

  hasChilds(node: FilePath): boolean {
    return node.childs && node.childs.length > 0;
  }


  isObject(val: any) {
    return typeof val === 'object' && !Array.isArray(val) && val !== null;
  }


  onNodeClick(value: FilePath) {
    this.currentPathChanged.emit(value);
  }

  onChildClick(event: MouseEvent, value: FilePath) {
    event.stopPropagation();
    this.currentPathChanged.emit(value);
  }

  onRightClick(event: MouseEvent, value: FilePath) {
    event.stopPropagation();
    event.preventDefault();
    this.rightClickNodeChanged.emit( [event,value]);
  }

   checked: boolean | undefined;


   @HostListener('document:mouseup')
   onMouseUp() {
     
   }

}

