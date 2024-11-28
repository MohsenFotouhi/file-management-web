import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatInputModule } from '@angular/material/input';
import { DialogService } from '../file-manager/dialog-service';
import { File, FileBlob, Folder } from '../../interface/files';
import { FilePath } from '../file-manager/components/path/file-path';
import { FileManagerService } from '../../services/file-manager.service';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { PathComponent } from '../file-manager/components/path/path.component';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SharedFilesComponent } from '../file-manager/components/shared-files/shared-files.component';
import { FileContextMenuComponent } from '../file-manager/components/file-context-menu/file-context-menu.component';

@Component({
  selector: 'vex-shared-with-user',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    SharedFilesComponent,
    NgClass,
    NgForOf,
    NgOptimizedImage,
    NgIf,
    FileContextMenuComponent,
    PathComponent
  ],
  templateUrl: './shared-with-user.component.html',
  styleUrl: './shared-with-user.component.scss'
})
export class SharedWithUserComponent implements OnInit, AfterViewInit {

  lastDownX = 0;
  clickCount = 0;
  clickTimeout: any;
  files: File[] = [];
  isResizing = false;
  folders: Folder[] = [];
  blobs: FileBlob[] = [];
  searchKeyWord: undefined;
  fromFile: boolean = false;
  selectedFiles: File[] = [];
  fromFolder: boolean = false;
  isListView: boolean = false;
  originalWidthTreeSidebar = 0;
  ShowFileMenu: boolean = false;
  ShowTreeMenu: boolean = false;
  originalWidthFolderContent = 0;
  showEmptyArea: boolean = false;
  selectedFolders: Folder[] = [];
  previousPaths: FilePath[] = [];
  currentPathItems: string[] = [];
  showShareFiles: boolean = false;
  pathFolderContextMenu!: FilePath;
  backButtonDisable: boolean = true;
  rootPath: FilePath = new FilePath();
  currentPath: FilePath = new FilePath();

  get upButtonEnable(): boolean {
    return this.currentPath.parent == undefined || this.currentPath.parent == '';
  }

  constructor(private service: FileManagerService,
              private dialogService: DialogService,
              private spinner: NgxSpinnerService) {
  }

  @ViewChild('mainContainer', { static: false }) mainContainer!: ElementRef;
  @ViewChild('treeSidebarSection', { static: false }) treeSidebarSection!: ElementRef;
  @ViewChild('folderContent', { static: false }) folderContent!: ElementRef;
  @ViewChild(FileContextMenuComponent) contextMenu!: FileContextMenuComponent;

  async ngOnInit(): Promise<void> {
    await this.getPath();
  }

  ngAfterViewInit(): void {
    const offsetX = this.treeSidebarSection.nativeElement.style.width.clientX - this.lastDownX;

    this.treeSidebarSection.nativeElement.style.width = ` ${this.originalWidthTreeSidebar + offsetX}px`;
    this.folderContent.nativeElement.style.width = this.mainContainer.nativeElement.offsetWidth - this.treeSidebarSection.nativeElement.offsetWidth - 2 + 'px';
  }

  async getPath() {
    await this.spinner.show();

    this.selectedFiles = [];
    try {
      const response = await firstValueFrom(this.service.getSharedFiles());
      this.rootPath.title = response.CurrentPath;
      this.rootPath.fullTitle = response.CurrentPath;
      this.folders = response.Folders || [];
      this.files = response.Files || [];
      this.rootPath.childs = [];
      for (const folder of this.folders) {
        this.rootPath.childs.push(
          {
            title: folder.FolderName,
            fullTitle: folder.VirtualPath,
            parent: folder.VirtualPath.split('\\')[0] + '\\',
            fileId: folder.FileId,
            childs: []
          });
      }
      await this.previews();
      this.currentPath = this.rootPath;
      this.currentPathItems = this.currentPath.parent != undefined ? this.currentPath.parent.split('\\') : [];
      this.currentPathItems = this.currentPathItems.filter(item => !!item);
    } catch (error) {
      console.error('API error:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  async getPaths(path: FilePath) {
    if (path.parent) {
      const command = 'GetContentById';
      this.rootPath.childs.forEach(element => {
        if (path.parent && !path.parent.startsWith(element.fullTitle))
          element.childs = [];
      });

      this.files = [];
      this.folders = [];
      await this.spinner.show();
      try {
        const response = await firstValueFrom(
          this.service.CallAPI(command, path.fileId)
        );

        this.folders = response.Folders || [];
        this.files = response.Files || [];
        await this.previews();

        let parentTitle: string = '';
        this.currentPath.childs = [];
        this.currentPathItems = this.currentPath.parent ?
          this.currentPath.parent.split('\\').filter(item => !!item) : [];

        for (const folder of this.folders) {
          parentTitle = '';
          let parents = folder.VirtualPath.split('\\');
          parents.splice(-1);
          parents.forEach(element => {
            if (parentTitle.trim().length > 0)
              parentTitle += '\\';
            parentTitle += element;
          });

          this.currentPath.childs.push({
            title: folder.FolderName,
            fullTitle: folder.VirtualPath,
            parent: parentTitle,
            fileId: folder.FileId,
            childs: []
          });
        }
      } catch (error) {
        console.error('API error:', error);
      } finally {
        await this.spinner.hide();
      }
    } else {
      await this.getPath();
    }
  }

  async previews() {
    this.blobs = [];
    for (const file of this.files) {
      if (file.FileName.endsWith('.png')) {
        try {
          const response = await firstValueFrom(
            this.service.preview('filePreview', (file.VirtualPath))
          );
          const fileURL = URL.createObjectURL(response);
          this.blobs.push({ file: file, content: fileURL });
        } catch (error) {
          console.error('File download error:', error);
        }
      } else {
        this.blobs.push({ file: file, content: '' });
      }
    }
  }

  async pathChange(path: FilePath) {
    this.previousPaths.push(this.currentPath);
    this.currentPath = path;
    this.currentPathItems = this.currentPath.parent ?
      this.currentPath.parent.split('\\').filter(item => !!item) : [];
    await this.getPaths(path);
    this.backButtonDisable = false;
  }

  /***************-Content Event-*****************/
  onFolderContentClick(event: any) {
    if (event && event.ctrlKey) return;
    this.selectedFiles = [];
    this.selectedFolders = [];
  }

  onFolderClick(event: MouseEvent, Folder: Folder) {
    if (this.clickTimeout) return;
    this.clickTimeout = setTimeout(() => {
      if (event && event.ctrlKey) {
        this.selectedFolders.push(Folder);
      } else {
        this.unselectedAllFolderFile();
        this.selectedFolders.push(Folder);
      }
      this.clickTimeout = null;
    }, 300);
  }

  async onFolderDblClick(folder: Folder) {
    clearTimeout(this.clickTimeout);
    this.clickTimeout = null;
    const child = this.currentPath.childs.find(x => x.title == folder.FolderName);
    if (child) await this.pathChange(child);
  }

  isFolderInSelectedFiles(file: Folder): boolean {
    return this.selectedFolders.includes(file);
  }

  isFileInSelectedFiles(currentFile: File): boolean {
    return this.selectedFiles.includes(currentFile);
  }

  onFileClick(event: MouseEvent, file: File) {
    this.clickCount++;
    setTimeout(() => {
      if (this.clickCount === 1) {
        if (this.clickTimeout) {
          clearTimeout(this.clickTimeout);
          this.clickTimeout = null;
        } else {
          this.clickTimeout = setTimeout(() => {
            this.selectedFileChanged(event, file);
            this.clickTimeout = null;
            this.clickTimeout = null;
          }, 250);
        }
      } else if (this.clickCount === 2) {
        console.log('double click');
      }
      this.clickCount = 0;
    }, 250);
  }

  getPathContent(i: number) {
    // currentPath.title
    console.log('i', i);
    console.log('his.currentPathItems ', this.currentPathItems);
    // this.currentPath.title = this.currentPathItems[i];
    // this.currentPathItems = this.removeFromCurrentPath(i);
    this.currentPath.fullTitle.split('\\');
    if (i == 0)
      this.getPath();
    var fullPath = this.currentPath.fullTitle.split('\\').splice(0, i + 1).join('\\').toString();
    console.log('fullPath', fullPath);
    this.rootPath.childs.find(x => x.fullTitle == fullPath);
    var navigate = this.rootPath.childs.find(x => x.fullTitle == fullPath);
    if (navigate != undefined)
      this.getPaths(navigate);

  }

  selectedFileChanged(event: any, currentFile: File) {
    if (event != undefined && event.ctrlKey)
      this.selectedFiles.push(currentFile);
    else {
      this.selectedFiles = [];
      this.selectedFolders = [];
      this.selectedFiles.push(currentFile);
    }
  }

  unselectedAllFolderFile() {
    this.selectedFolders = [];
    this.selectedFiles = [];
  }

  /***************-Toolbar Event-*****************/
  async backButtonClicked() {
    this.currentPath = this.previousPaths.splice(this.previousPaths.length - 1, 1)[0];
    this.currentPathItems = this.currentPath.parent ?
      this.currentPath.parent.split('\\').filter(item => !!item) : [];
    await this.getPaths(this.currentPath);
    this.backButtonDisable = this.previousPaths.length == 0;
  }

  async upButtonClicked() {
    if (this.currentPath.parent) {
      this.previousPaths.push(this.currentPath);
      this.currentPath = this.previousPaths.find(x => x.fullTitle == this.currentPath.parent) || new FilePath();
      this.currentPathItems = this.currentPath.parent ?
        this.currentPath.parent.split('\\').filter(item => !!item) : [];
      if (!this.currentPath.fullTitle)
        await this.getPath();
      else
        await this.getPaths(this.currentPath);
    }
  }

  async downloadClicked() {
    try {
      for (const file of this.selectedFiles) {
        const response = await firstValueFrom(
          this.service.downloadShareFiles(file.FileId, file.VirtualPath)
        );
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = file.FileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
      }
    } catch (error) {
      console.error('File download error:', error);
    }
  }

  SwitchView() {
    this.isListView = !this.isListView;
  }

  async search() {
    try {
      await this.spinner.show();
      const response = await firstValueFrom(
        this.service.CallAPI('search', JSON.stringify({
          Path: this.currentPath.title,
          Query: this.searchKeyWord
        }))
      );

      this.folders = response.Folders || [];
      this.files = response.Files || [];
      await this.previews();
    } catch (error) {
      console.error('API error:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  /****************-Context Event-******************/
  pathRightClick([event, path]: [MouseEvent, FilePath]) {
    this.pathFolderContextMenu = path;
    this.onContextMenu(event, 'tree');
  }

  onContextMenu(event: MouseEvent, from: string) {
    if (event != undefined)
      event.preventDefault();

    if (this.fromFile) {
      this.fromFile = false;
      return;
    }
    this.contextMenu.show(event, from);
    this.ShowFileMenu = from == 'file';
    this.ShowTreeMenu = from == 'tree';
    this.showEmptyArea = from == 'emptyArea';

    this.selectedFiles = [];
    this.selectedFolders = [];
  }

  onFolderContextMenu(event: MouseEvent, _currentFile: any) {
    event.preventDefault();
    this.fromFolder = true;
    this.fromFile = true;
    // this.selectedFolderChanged(undefined, currentFile);
    this.contextMenu.show(event, 'file');
  }

  onFileContextMenu(event: MouseEvent, currentFile: any) {
    event.preventDefault();
    this.fromFile = true;
    this.fromFolder = false;
    this.selectedFileChanged(undefined, currentFile);
    this.contextMenu.show(event, 'file');
  }

  /**********************-Resize Event-************************/
  ResizeWindow(event: MouseEvent) {
    this.isResizing = true;
    this.lastDownX = event.clientX;
    this.originalWidthTreeSidebar = this.treeSidebarSection.nativeElement.offsetWidth;
    this.originalWidthFolderContent = this.folderContent.nativeElement.offsetWidth;

    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    const offsetX = event.clientX - this.lastDownX;

    this.treeSidebarSection.nativeElement.style.width = ` ${this.originalWidthTreeSidebar + offsetX}px`;
    this.folderContent.nativeElement.style.width = this.mainContainer.nativeElement.offsetWidth - this.treeSidebarSection.nativeElement.offsetWidth - 10 + 'px';
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }

  @HostListener('window:resize', ['$event'])
  windowsResize() {
    this.folderContent.nativeElement.style.width = this.mainContainer.nativeElement.offsetWidth - this.treeSidebarSection.nativeElement.offsetWidth - 10 + 'px';
  }
}
