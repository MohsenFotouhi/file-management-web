import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FilePath } from './file-path';

@Component({
  selector: 'app-path',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './path.component.html',
  styleUrl: './path.component.css'
})
export class PathComponent implements OnInit
{

  ngOnInit(): void
  {
    this.setSharedFileStatus(false);
  }


  @Input()
  rootPath: FilePath = new FilePath();

  @Output()
  currentPathChanged = new EventEmitter<FilePath>();

  @Output()
  currentChildPathChanged = new EventEmitter<FilePath>();

  @Output()
  rightClickNodeChanged = new EventEmitter<[MouseEvent, FilePath]>();

  @Output()
  fileShareStatus = new EventEmitter<boolean>();
  constructor()
  {
  }

  hasChilds(node: FilePath): boolean
  {
    return node.childs && node.childs.length > 0;
  }


  isObject(val: any)
  {
    return typeof val === 'object' && !Array.isArray(val) && val !== null;
  }


  onNodeClick(value: FilePath)
  {
    this.currentPathChanged.emit(value);
    this.setSharedFileStatus(false);
  }

  onChildClick(event: MouseEvent, value: FilePath)
  {
    event.stopPropagation();
    this.currentPathChanged.emit(value);
    this.setSharedFileStatus(false);
  }

  onRightClick(event: MouseEvent, value: FilePath)
  {
    event.stopPropagation();
    event.preventDefault();
    this.rightClickNodeChanged.emit([event, value]);
  }

  setSharedFileStatus(sharedStatus: boolean)
  {
    this.fileShareStatus.emit(sharedStatus);
  }

  checked: boolean | undefined;


  @HostListener('document:mouseup')
  onMouseUp()
  {

  }

}

