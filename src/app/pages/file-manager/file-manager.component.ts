import { firstValueFrom } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from './dialog-service';
import { MatDialog } from '@angular/material/dialog';
import { FilePath } from './components/path/file-path';
import { ToastService } from '../../services/toast.service';
import { File, FileBlob, Folder } from '../../interface/files';
import { FileDownloadService } from '../../services/file-download.service';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { ShareModalComponent } from './components/share-modal/share-modal.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { FileContextMenuComponent } from './components/file-context-menu/file-context-menu.component';

@Component({
  selector: 'vex-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent implements OnInit, AfterViewInit {
  progress = 0;
  lastDownX = 0;
  clickCount = 0;
  clickTimer: any;
  isResizing = false;
  originalWidth1 = 0;
  originalWidth2 = 0;
  files: File[] = [];
  fromPath: string = '';
  blobs: FileBlob[] = [];
  folders: Folder[] = [];
  actionName: string = '';
  searchKeyWord: undefined;
  isDownloadWithIDM = true;
  canPaste: boolean = false;
  fromFile: boolean = false;
  selectedFiles: File[] = [];
  isListView: boolean = false;
  fromFolder: boolean = false;
  fromContext: boolean = false;
  ShowFileMenu: boolean = false;
  ShowTreeMenu: boolean = false;
  selectedFolders: Folder[] = [];
  showEmptyArea: boolean = false;
  previousPaths: FilePath[] = [];
  currentPathItems: string[] = [];
  showShareFiles: boolean = false;
  backButtonEnable: boolean = true;
  fromcontext: boolean | undefined;
  pathFolderContextMenu!: FilePath;
  rootPath: FilePath = new FilePath();
  fromPathContext!: string | undefined;
  currentPath: FilePath = new FilePath();

  @ViewChild('resizableDiv1', { static: false }) resizableDiv1!: ElementRef;
  @ViewChild('resizableDiv2', { static: false }) resizableDiv2!: ElementRef;
  @ViewChild(FileContextMenuComponent) contextMenu!: FileContextMenuComponent;
  @ViewChild('resizableContainer', { static: false })
  resizableContainer!: ElementRef;
  @ViewChild(FileContextMenuComponent, { static: false })
  fileMenu!: FileContextMenuComponent;

  constructor(private dialog: MatDialog,
              private toast: ToastService,
              private spinner: NgxSpinnerService,
              private service: FileManagerService,
              private dialogService: DialogService,
              private fileDownloadService: FileDownloadService) {
    // this.fileDownloadService.progress$.subscribe((value) => {
    //   this.progress = value;
    // });
    this.fileDownloadService.isDownloadWithIDM$.subscribe((value) => {
      this.isDownloadWithIDM = value;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getPath();
  }

  ngAfterViewInit(): void {
    const offsetX =
      this.resizableDiv1.nativeElement.style.width.clientX - this.lastDownX;
    this.resizableDiv1.nativeElement.style.width = ` ${this.originalWidth1 + offsetX}px`;
    this.resizableDiv2.nativeElement.style.width =
      this.resizableContainer.nativeElement.offsetWidth -
      this.resizableDiv1.nativeElement.offsetWidth -
      2 +
      'px';
  }

  setSharedFile(status: boolean) {
    this.showShareFiles = status;
  }

  get upButtonEnable(): boolean {
    return (
      this.currentPath.parent == undefined || this.currentPath.parent == ''
    );
  }

  async getPath() {
    try {
      this.selectedFiles = [];
      const response = await firstValueFrom(
        this.service.CallAPI('getFolderContent', '')
      );
      await this.bindingData(response);
    } catch (error) {
      console.error('API error:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  async bindingData(response: any) {
    this.rootPath.title = response.CurrentPath;
    this.rootPath.fullTitle = response.CurrentPath;
    this.folders = response.Folders;
    this.files = response.Files;
    this.rootPath.childs = [];
    for (const folder of this.folders) {
      this.rootPath.childs.push({
        title: folder.FolderName,
        fullTitle: folder.VirtualPath,
        parent: folder.VirtualPath.split('\\')[0] + '\\',
        fileId: folder.FileId,
        childs: []
      });
    }
    await this.previews();
    this.currentPath = this.rootPath;
    this.currentPathItems = this.currentPath.parent
      ? this.currentPath.parent.split('\\').filter((item) => !!item)
      : [];
  }

  async getPaths(path: FilePath) {
    try {
      this.rootPath.childs.forEach((element) => {
        if (path.parent && !path.parent.startsWith(element.fullTitle))
          element.childs = [];
      });

      this.files = [];
      this.folders = [];
      await this.spinner.show();

      const response = await firstValueFrom(
        this.service.CallAPI('getFolderContent', path.fullTitle)
      );

      this.files = response.Files || [];
      this.folders = response.Folders || [];

      await this.previews();

      this.currentPath.childs = [];
      this.currentPathItems = this.currentPath.parent
        ? this.currentPath.parent.split('\\').filter((item) => !!item)
        : [];

      let parentTitle: string = '';
      for (const folder of this.folders) {
        parentTitle = '';
        let parents = folder.VirtualPath.split('\\');
        parents.splice(-1);
        parents.forEach((element) => {
          if (parentTitle.trim().length > 0) parentTitle += '\\';
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
  }

  async previews() {
    this.blobs = [];
    for (const file of this.files) {
      if (file.FileName.endsWith('.png') && false) {
        try {
          const response = await firstValueFrom<Blob>(
            this.service.preview('filePreview', file.VirtualPath)
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
    this.currentPathItems = this.currentPath.parent
      ? this.currentPath.parent.split('\\').filter((item) => !!item)
      : [];
    await this.getPaths(path);
    this.backButtonEnable = false;
  }

  openShareModal(): void {
    let virtualPath: any;
    if (this.selectedFiles.length > 0)
      virtualPath = this.selectedFiles.splice(0, 1)[0];
    else if (this.selectedFolders.length > 0)
      virtualPath = this.selectedFolders.splice(0, 1)[0];
    else return;
    this.dialog.open(ShareModalComponent, {
      width: '500px',
      data: virtualPath
    });
  }

  async getPathContent(i: number) {
    if (i == 0) await this.getPath();

    let fullPath = this.currentPath.fullTitle
      .split('\\')
      .splice(0, i + 1)
      .join('\\')
      .toString();

    let navigate = this.rootPath.childs.find((x) => x.fullTitle == fullPath);
    if (navigate) await this.getPaths(navigate);
  }

  pathRightClick([event, path]: [MouseEvent, FilePath]) {
    this.pathFolderContextMenu = path;
    this.fromcontext = true;
    this.onContextMenu(event, 'tree');
  }

  /**********************-Toolbar Event-************************/
  async backButtonClicked() {
    this.currentPath = this.previousPaths.splice(
      this.previousPaths.length - 1,
      1
    )[0];
    this.currentPathItems = this.currentPath.parent
      ? this.currentPath.parent.split('\\').filter((item) => !!item)
      : [];
    await this.getPaths(this.currentPath);
    this.backButtonEnable = !!this.previousPaths.length;
  }

  async upButtonClicked() {
    if (this.currentPath.parent) {
      this.previousPaths.push(this.currentPath);
      this.currentPath =
        this.previousPaths.find(
          (x) => x.fullTitle == this.currentPath.parent
        ) || new FilePath();
      this.currentPathItems = this.currentPath.parent
        ? this.currentPath.parent.split('\\').filter((item) => !!item)
        : [];
      if (!this.currentPath.fullTitle) {
        await this.getPath();
      } else {
        await this.getPaths(this.currentPath);
      }
    }
  }

  copyButtonClicked() {
    this.canPaste = true;
    this.actionName = 'copy';
    this.fromPath = this.currentPath.fullTitle;
    if (this.ShowTreeMenu) this.copyFromContextButtonClicked();
  }

  copyFromContextButtonClicked() {
    const folder = this.folders.find(
      (x) => x.FolderName == this.pathFolderContextMenu.title
    );
    if (folder) {
      this.selectedFolders.push(folder);
      this.fromPathContext = folder.VirtualPath;
    }
  }

  cutButtonClicked() {
    this.canPaste = true;
    this.actionName = 'cut';
    this.fromPath = this.currentPath.fullTitle;
    if (this.ShowTreeMenu) this.cutFromContextButtonClicked();
  }

  cutFromContextButtonClicked() {
    const folder = this.folders.find(
      (x) => x.FolderName == this.pathFolderContextMenu.title
    );
    if (folder) {
      this.selectedFolders.push(folder);
      this.fromPathContext = folder.VirtualPath;
    }
  }

  async pasteButtonClicked() {
    await this.paste();
    this.canPaste = false;
    await this.getPaths(this.currentPath);
  }

  async paste() {
    const exists = this.files
      .map((x) => x.FileName)
      .some((item) => this.selectedFiles.map((i) => i.FileName).includes(item));

    if (exists) {
      const confirmed = await this.dialogService.openConfirmationDialog(
        'برخی از موارد از قبل وجود دارند، آیا مایل به بازنویسی هستید؟'
      );
      if (!confirmed) return;
    }

    let Items: string[] = [];
    this.selectedFiles.forEach((selectedFile) => {
      Items.push(this.fromPath + '\\' + selectedFile.FileName);
    });
    this.selectedFolders.forEach((selectedFile) => {
      Items.push(this.fromPath + '\\' + selectedFile.FolderName);
    });
    const data = {
      Path: this.currentPath.fullTitle + '\\',
      Items: Items
    };
    await this.callApiWithResponse(this.actionName, JSON.stringify(data));
  }

  async renameButtonClicked() {
    await this.rename();
    await this.getPaths(this.currentPath);
  }

  async rename() {
    let newName: any;
    if (this.selectedFiles.length > 0) {
      newName = this.selectedFiles[0].FileName;
    } else if (this.selectedFolders.length > 0) {
      newName = this.selectedFolders[0].FolderName;
    } else {
      return;
    }

    newName = await this.dialogService.openRenameDialog(newName);
    if (newName) {
      let Items: string[] = [];
      let ListId: string[] = [];
      this.selectedFiles.forEach((selectedFile) => {
        Items.push(this.currentPath.title + '\\' + selectedFile.FileName);
        ListId.push(selectedFile.FileId);
      });
      this.selectedFolders.forEach((selectedFile) => {
        Items.push(this.currentPath.title + '\\' + selectedFile.FolderName);
        ListId.push(selectedFile.FileId);
      });
      const data = {
        Path: this.currentPath.title,
        ParentDirectoryID: this.currentPath.fileId,
        Items: Items,
        NewName: newName,
        ListId: ListId
      };
      const jsonData = JSON.stringify(data);
      await this.callApiWithResponse('rename', jsonData);
      this.selectedFiles = [];
      this.selectedFolders = [];
    }
  }

  async deleteButtonClicked() {
    await this.delete();
  }

  async delete() {
    const confirmed = await this.dialogService.openConfirmationDialog(
      'آیا از حذف آیتم های انتخابی اطمینان دارید؟'
    );

    if (confirmed) {
      let Items: string[] = [];
      let ListId: string[] = [];

      if (this.fromcontext) {
        Items.push(this.pathFolderContextMenu.fullTitle);
      }

      for (const folder of this.selectedFolders) {
        Items.push(folder.VirtualPath);
        ListId.push(folder.FileId);
      }

      for (const file of this.selectedFiles) {
        Items.push(this.currentPath.fullTitle + '\\' + file.FileName);
        ListId.push(file.FileId);
      }

      const data = {
        Path: this.currentPath.fullTitle,
        ParentDirectoryID: this.currentPath.fileId,
        Items: Items,
        ListId: ListId
      };

      if (this.fromcontext || this.selectedFolders.length > 0) {
        await this.callApi('delete', JSON.stringify(data));
      } else {
        await this.callApiWithResponse('delete', JSON.stringify(data));
      }

      this.service.getUserStorageUse().subscribe();
    }
  }

  async addNewFolderButtonClicked() {
    let folderName: any;
    let path = this.fromcontext
      ? this.pathFolderContextMenu.fullTitle
      : this.currentPath.fullTitle;
    folderName = 'NewFolder';
    folderName = await this.dialogService.openRenameDialog(folderName);
    if (folderName) {
      const data = {
        Path: path,
        ParentDirectoryID: this.currentPath.fileId,
        FolderName: folderName
      };
      const jsonData = JSON.stringify(data);
      await this.callApi('CreateNewFolder', jsonData);
    }
  }

  async addNewFileButtonClicked() {
    let fileName: any;
    fileName = 'NewFile.txt';
    fileName = await this.dialogService.openRenameDialog(fileName);
    if (fileName) {
      const data = {
        Path: this.currentPath.fullTitle,
        ParentDirectoryID: this.currentPath.fileId,
        FileName: fileName
      };
      await this.callApiWithResponse('CreateNewFile', JSON.stringify(data));
    }
  }

  async downloadButtonClicked() {
    await this.download();
  }

  async download() {
    this.toast.open('فایل در حال دانلود است، لطفا شکیبا باشید.');
    for (const file of this.selectedFiles) {
      try {
        await this.service.downloadFileWithRange(file.FileId, file.RealFileSize, file.FarsiName || file.FileName);
      } catch (error) {
        console.error('File download error:', error);
      }
    }
  }

  async zipButtonClicked() {
    let newName: any;
    if (this.selectedFiles.length > 0) {
      newName = this.selectedFiles[0].FileName;
    } else if (this.selectedFolders.length > 0) {
      newName = this.selectedFolders[0].FolderName;
    } else {
      return;
    }

    let Items: string[] = [];
    let selectedCount = this.selectedFiles.length + this.selectedFolders.length;
    if (selectedCount > 1) {
      newName = await this.dialogService.openRenameDialog(newName);
    }
    if (selectedCount == 1 || newName) {
      this.selectedFolders.forEach((selectedFile) => {
        Items.push(this.currentPath.title + '\\' + selectedFile.FolderName);
      });

      this.selectedFiles.forEach((selectedFile) => {
        Items.push(this.currentPath.title + '\\' + selectedFile.FileName);
      });

      const data = {
        Path: this.currentPath.title,
        Items: Items,
        FileName: newName
      };
      await this.callApiWithResponse('zip', JSON.stringify(data));
    }
  }

  async unzipButtonClicked() {
    let Items: string[] = [];
    this.selectedFolders.forEach((selectedFile) => {
      Items.push(this.currentPath.title + '\\' + selectedFile.FolderName);
    });

    this.selectedFiles.forEach((selectedFile) => {
      Items.push(this.currentPath.title + '\\' + selectedFile.FileName);
    });

    const data = {
      Path: this.currentPath.title,
      Items: Items
    };
    await this.callApiWithResponse('unzip', JSON.stringify(data));
  }

  SwitchView() {
    this.isListView = !this.isListView;
  }

  async search() {
    const data = {
      Path: this.currentPath.title,
      ParentDirectoryID: this.currentPath.fileId,
      Query: this.searchKeyWord
    };
    await this.callApiWithResponse('search', JSON.stringify(data));
  }

  /**********************-Context Event-************************/
  async reload() {
    await this.pathChange(this.currentPath);
  }

  async upload() {
    let path = this.currentPath.fullTitle;
    if (this.fromcontext) {
      path = this.pathFolderContextMenu.fullTitle;
    } else if (this.fromFolder) {
      path = this.selectedFolders.splice(this.selectedFolders.length - 1, 1)[0]
        .VirtualPath;
    }

    await this.dialogService.openUploadDialog(path);
    await this.getPaths(this.currentPath);
  }

  onContextMenu(event: MouseEvent, from: string) {
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

  onFileContextMenu(event: MouseEvent, currentFile: any) {
    event.preventDefault();
    this.fromFile = true;
    this.fromFolder = false;
    this.selectedFileChanged(undefined, currentFile);
    this.contextMenu.show(event, 'file');
  }

  onFolderContextMenu(event: MouseEvent, currentFile: any) {
    event.preventDefault();
    this.fromFolder = true;
    this.fromFile = true;
    this.selectedFolderChanged(undefined, currentFile);
    this.contextMenu.show(event, 'file');
  }

  /**********************-Selected Event-************************/
  selectedFolderChanged(event: any, currentFile: Folder) {
    this.fromContext = false;
    if (event && event.ctrlKey) {
      this.selectedFolders.push(currentFile);
    } else {
      this.selectedFolders = [];
      this.selectedFiles = [];
      this.selectedFolders.push(currentFile);
    }
  }

  selectedFileChanged(event: any, currentFile: File) {
    this.fromContext = false;
    if (event && event.ctrlKey) {
      this.selectedFiles.push(currentFile);
    } else {
      this.selectedFiles = [];
      this.selectedFolders = [];
      this.selectedFiles.push(currentFile);
    }
  }

  isFolderInSelectedFiles(file: Folder): boolean {
    return this.selectedFolders.includes(file);
  }

  isFileInSelectedFiles(currentFile: File): boolean {
    return this.selectedFiles.includes(currentFile);
  }

  async onFolderClick(event: MouseEvent, file: Folder) {
    if (this.clickTimer) {
      this.fromContext = false;
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      await this.doubleClick(file);
    } else {
      this.clickTimer = setTimeout(() => {
        this.selectedFolderChanged(event, file);
        this.clickTimer = null;
        this.clickTimer = null;
      }, 250);
    }
  }

  async doubleClick(folder: Folder) {
    const folderSelected = this.currentPath.childs.find(
      (x) => x.title == folder.FolderName
    );
    if (folderSelected) await this.pathChange(folderSelected);
  }

  onFileClick(event: MouseEvent, file: File) {
    this.clickCount++;
    setTimeout(() => {
      if (this.clickCount === 1) {
        if (this.clickTimer) {
          this.fromContext = false;
          clearTimeout(this.clickTimer);
          this.clickTimer = null;
        } else {
          this.clickTimer = setTimeout(() => {
            this.selectedFileChanged(event, file);
            this.clickTimer = null;
            this.clickTimer = null;
          }, 250);
        }
      } else if (this.clickCount === 2) {
        console.log('double click');
      }
      this.clickCount = 0;
    }, 250);
  }

  onDivClick(event: any) {
    if (this.fileMenu) this.fileMenu.hide();

    if (event && event.ctrlKey) return;

    this.selectedFiles = [];
    this.selectedFolders = [];
  }

  async callApi(command: string, parameters: string) {
    try {
      await this.spinner.show();
      await firstValueFrom(this.service.CallAPI(command, parameters));
      await this.getPaths(this.currentPath);
    } catch (error) {
      console.error('API error:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  async callApiWithResponse(command: string, parameters: string) {
    try {
      await this.spinner.show();
      const response = await firstValueFrom(
        this.service.CallAPI(command, parameters)
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

  /**********************-Resize Event-************************/
  onMouseDown(event: MouseEvent, _direction: 'left' | 'right') {
    this.isResizing = true;
    this.lastDownX = event.clientX;
    this.originalWidth1 = this.resizableDiv1.nativeElement.offsetWidth;
    this.originalWidth2 = this.resizableDiv2.nativeElement.offsetWidth;

    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    const offsetX = event.clientX - this.lastDownX;

    this.resizableDiv1.nativeElement.style.width = ` ${this.originalWidth1 + offsetX}px`;
    this.resizableDiv2.nativeElement.style.width =
      this.resizableContainer.nativeElement.offsetWidth -
      this.resizableDiv1.nativeElement.offsetWidth -
      10 +
      'px';
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }

  @HostListener('window:resize', ['$event'])
  windowsResize() {
    this.resizableDiv2.nativeElement.style.width =
      this.resizableContainer.nativeElement.offsetWidth -
      this.resizableDiv1.nativeElement.offsetWidth -
      10 +
      'px';
  }
}
