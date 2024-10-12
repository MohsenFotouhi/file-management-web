import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { file, fileBlob, folder } from '../../interface/files';
import { FileService } from "../../services/file.service";
import { FileContextMenuComponent } from './components/file-context-menu/file-context-menu.component';
import { FilePath } from './components/path/file-path';
import { ShareModalComponent } from "./components/share-modal/share-modal.component";
import { DialogService } from './dialog-service';

@Component({
  selector: 'vex-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent implements OnInit, AfterViewInit
{
  tabChange(event: any)
  {
    console.log('event', event);
    this.loadShareFiles();
  }
  rootPath: FilePath = new FilePath();
  currentPath: FilePath = new FilePath();
  folders: folder[] = [];
  files: file[] = [];
  selectedFiles: file[] = [];
  selectedFolders: folder[] = [];
  previousPathes: FilePath[] = [];
  searchKeyWord: undefined;
  isListView: boolean = false;
  pathFolderContextMenu!: FilePath;
  actionName: string = "";
  fromPathContext!: string | undefined;
  fromContext: boolean = false;
  canPaste: boolean = false;
  fromPath: string = '';
  currentPathItems: string[] = [];
  showShareFiles: boolean = false;

  constructor(private service: FileManagerService,
    private fileService: FileService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService)
  {
  }

  ngOnInit(): void
  {
    this.getPath();
  }


  ngAfterViewInit(): void
  {
    const offsetX = this.resizableDiv1.nativeElement.style.width.clientX - this.lastDownX;

    this.resizableDiv1.nativeElement.style.width = ` ${ this.originalWidth1 + offsetX }px`;
    this.resizableDiv2.nativeElement.style.width = this.resizableContainer.nativeElement.offsetWidth - this.resizableDiv1.nativeElement.offsetWidth - 2 + 'px';
  }

  openShareModal(): void
  {
    var virtualPath = this.selectedFiles.splice(0, 1)[0];
    this.dialog.open(ShareModalComponent, { width: '500px', data: virtualPath });
  }

  isLoading = false;

  async getPath()
  {
    // this.spinner.show();
    const command = 'getFolderContent';
    this.selectedFiles = [];
    await this.service.CallAPI(command, '').subscribe(
      response =>
      {
        // this.resizableDiv2.nativeElement.style.width = this.resizableContainer.nativeElement.offsetWidth - this.resizableDiv1.nativeElement.offsetWidth - 10 + 'px';
        this.rootPath.title = response.CurrentPath;
        this.rootPath.fullTitle = response.CurrentPath;
        this.folders = response.Folders;
        this.rootPath.childs = [];
        for (let i = 0; i < this.folders.length; i++)
          this.rootPath.childs.push(

            {
              title: this.folders[i].FolderName,
              fullTitle: this.folders[i].VirtualPath,
              parent: this.folders[i].VirtualPath.split("\\")[0] + "\\",
              childs: []
            });
        this.files = response.Files;
        this.currentPath = this.rootPath;
        this.previews();
        this.currentPathItems = this.currentPath.parent != undefined ? this.currentPath.parent.split("\\") : [];
        this.currentPathItems = this.currentPathItems.filter(item => !!item);
      },
      error =>
      {
        console.error('API error:', error);
      },
      () =>
      {

        this.spinner.hide();
      }
    );
  }

  getPaths(path: FilePath)
  {
    const command = 'getFolderContent';
    this.rootPath.childs.forEach(element =>
    {
      if (path.parent != undefined)
        if (!path.parent.startsWith(element.fullTitle))
          element.childs = [];
    });
    this.folders = [];
    this.files = [];
    this.spinner.show();
    this.service.CallAPI(command, path.fullTitle).subscribe(
      response =>
      {
        this.folders = response.Folders ?? [];
        this.files = response.Files ?? [];
        this.previews();

        var parentTitle: string = "";
        this.currentPath.childs = [];
        this.currentPathItems = this.currentPath.parent != undefined ? this.currentPath.parent.split("\\") : [];
        this.currentPathItems = this.currentPathItems.filter(item => !!item);
        for (let i = 0; i < this.folders.length; i++)
        {
          parentTitle = "";
          var parents = this.folders[i].VirtualPath.split("\\");
          parents.splice(-1);
          parents.forEach(element =>
          {
            if (parentTitle.trim().length > 0)
              parentTitle += "\\";
            parentTitle += element;
          });

          this.currentPath.childs.push(
            {
              title: this.folders[i].FolderName,
              fullTitle: this.folders[i].VirtualPath,
              parent: parentTitle,
              childs: []
            });
        }
      },
      error =>
      {
        console.error('API error:', error);
      },
      () =>
      {
        this.spinner.hide();
      }
    );

  }


  getPathContent(i: number)
  {
    // currentPath.title
    console.log('i', i);
    console.log('his.currentPathItems ', this.currentPathItems);
    // this.currentPath.title = this.currentPathItems[i];
    // this.currentPathItems = this.removeFromCurrentPath(i);
    this.currentPath.fullTitle.split("\\");
    if (i == 0)
      this.getPath();
    var fullPath = this.currentPath.fullTitle.split("\\").splice(0, i + 1).join("\\").toString();
    console.log('fullPath', fullPath);
    this.rootPath.childs.find(x => x.fullTitle == fullPath);
    var navigate = this.rootPath.childs.find(x => x.fullTitle == fullPath);
    if (navigate != undefined)
      this.getPaths(navigate);

  }


  removeFromCurrentPath(index: number): string[]
  {
    return index > -1 ? this.currentPathItems.slice(0, index) : [];
  }


  pathChange(path: FilePath)
  {
    this.previousPathes.push(this.currentPath);
    this.currentPath = path;
    this.currentPathItems = this.currentPath.parent != undefined ? this.currentPath.parent.split("\\") : [];
    this.currentPathItems = this.currentPathItems.filter(item => !!item);
    this.getPaths(path);
    this.backButtonEnable = false;
  }


  pathRighClick([event, path]: [MouseEvent, FilePath])
  {
    this.pathFolderContextMenu = path;
    this.fromcontext = true;
    this.onContextMenu(event, 'tree');
  }

  loadShareFiles()
  {
    this.spinner.show();
    this.service.getSharedFiles().subscribe(response =>
    {
      this.files = response.Files,
        this.folders = [],
        this.previews();
    },
      error =>
      {
        console.error('API error:', error);
      },
      () =>
      {

        this.spinner.hide();
      });
  }

  backButtonClicked()
  {
    var path = this.previousPathes.splice(this.previousPathes.length - 1, 1)[0];
    this.currentPath = path;
    this.currentPathItems = this.currentPath.parent != undefined ? this.currentPath.parent.split("\\") : [];
    this.currentPathItems = this.currentPathItems.filter(item => !!item);
    this.getPaths(this.currentPath);
    this.backButtonEnable = this.previousPathes.length == 0;
  }

  upButtonClicked()
  {
    if (this.currentPath.parent != undefined)
    {
      this.previousPathes.push(this.currentPath);
      this.currentPath = this.previousPathes.find(x => x.fullTitle == this.currentPath.parent) ?? new FilePath();
      this.currentPathItems = this.currentPath.parent != undefined ? this.currentPath.parent.split("\\") : [];
      this.currentPathItems = this.currentPathItems.filter(item => !!item);
      if (this.currentPath.fullTitle == '' || this.currentPath.fullTitle == undefined)
        this.getPath();
      else
        this.getPaths(this.currentPath);
    }
  }


  copyButtonClicked()
  {
    this.canPaste = true;
    this.actionName = "copy";
    this.fromPath = this.currentPath.fullTitle;
    if (this.ShowTreeMenu == true)
      this.copyFromContextButtonClicked();
  }


  copyFromContextButtonClicked()
  {
    if (this.folders.find(x => x.FolderName == this.pathFolderContextMenu.title) != undefined)
    {
      this.selectedFolders.push(this.folders.find(x => x.FolderName == this.pathFolderContextMenu.title) || new folder());
      this.fromPathContext = this.folders.find(x => x.FolderName == this.pathFolderContextMenu.title)?.VirtualPath;
    }
  }


  cutButtonClicked()
  {
    this.canPaste = true;
    this.actionName = "cut";
    this.fromPath = this.currentPath.fullTitle;
    if (this.ShowTreeMenu == true)
      this.cutFromContextButtonClicked();
  }

  cutFromContextButtonClicked()
  {
    if (this.folders.find(x => x.FolderName == this.pathFolderContextMenu.title) != undefined)
    {
      this.selectedFolders.push(this.folders.find(x => x.FolderName == this.pathFolderContextMenu.title) || new folder());
      this.fromPathContext = this.folders.find(x => x.FolderName == this.pathFolderContextMenu.title)?.VirtualPath;
    }
  }

  async pasteButtonClicked()
  {
    await this.paste();
    this.canPaste = false;
    this.getPaths(this.currentPath);
  }

  async renameButtonClicked()
  {
    await this.rename();
    this.getPaths(this.currentPath);
  }

  async deleteButtonClicked()
  {
    await this.delete();
  }

  async paste()
  {
    const exists = this.files.map(x => x.FileName).some(item => this.selectedFiles.map(i => i.FileName).includes(item));
    if (exists)
    {
      const confirmed = await this.dialogService.openConfirmationDialog("برخی از موارد از قبل وجود دارند، آیا مایل به بازنویسی هستید؟");
      if (!confirmed) return;
    }
    var Items: string[] = [];
    this.selectedFiles.forEach(selectedFile =>
    {
      Items.push(this.fromPath + "\\" + selectedFile.FileName);
    });
    this.selectedFolders.forEach(selectedFile =>
    {
      Items.push(this.fromPath + "\\" + selectedFile.FolderName);
    });
    const data = {
      "Path": this.currentPath.fullTitle + "\\",
      "Items": Items
    };
    this.callApiWithResponse(this.actionName, JSON.stringify(data));
  }


  fromcontext: boolean | undefined;

  async addNewFolderButtonClicked()
  {
    var folderName: any;
    var path = this.fromcontext ? this.pathFolderContextMenu.fullTitle : this.currentPath.fullTitle;
    folderName = "NewFolder";
    folderName = await this.dialogService.openRenameDialog(folderName);
    if (folderName != undefined)
    {
      const data = {
        Path: path,
        FolderName: folderName
      };
      const jsonData = JSON.stringify(data);
      this.callApi("CreateNewFolder", jsonData);
    }
  }


  async addNewFileButtonClicked()
  {
    var fileName: any;
    fileName = "NewFile.txt";
    fileName = await this.dialogService.openRenameDialog(fileName);
    if (fileName != undefined)
    {
      const data = {
        Path: this.currentPath.fullTitle,
        FileName: fileName
      };
      const jsonData = JSON.stringify(data);
      this.callApiWithResponse("CreateNewFile", jsonData);
    }
  }


  viewButtonClicked()
  {
    this.download();
  }

  downloadButtonClicked()
  {
    this.download();
  }

  async zipdButtonClicked()
  {
    var Items: string[] = [];

    var newName: any;
    if (this.selectedFiles.length == 0 && this.selectedFolders.length == 0) return;
    if (this.selectedFiles.length > 0)
      newName = this.selectedFiles[0].FileName;
    else if (this.selectedFolders.length > 0)
      newName = this.selectedFolders[0].FolderName;
    var selectedCount = this.selectedFiles.length + this.selectedFolders.length;
    if (selectedCount > 1)
      newName = await this.dialogService.openRenameDialog(newName);
    if (selectedCount == 1 || newName != undefined)
    {
      this.selectedFolders.forEach(selectedFile =>
      {
        Items.push(this.currentPath.title + "\\" + selectedFile.FolderName);
      });
      this.selectedFiles.forEach(selectedFile =>
      {
        Items.push(this.currentPath.title + "\\" + selectedFile.FileName);
      });
      const data = {
        Path: this.currentPath.title,
        Items: Items,
        FileName: newName
      };
      const jsonData = JSON.stringify(data);
      this.callApiWithResponse("zip", jsonData);
    }
  }

  async unZipdButtonClicked()
  {
    var Items: string[] = [];
    this.selectedFolders.forEach(selectedFile =>
    {
      Items.push(this.currentPath.title + "\\" + selectedFile.FolderName);
    });
    this.selectedFiles.forEach(selectedFile =>
    {
      Items.push(this.currentPath.title + "\\" + selectedFile.FileName);
    });
    const data = {
      Path: this.currentPath.title,
      Items: Items
    };
    const jsonData = JSON.stringify(data);
    this.callApiWithResponse("unzip", jsonData);
  }

  SwitchView()
  {
    this.isListView = !this.isListView;
  }

  async search()
  {
    const data = {
      Path: this.currentPath.title,
      Query: this.searchKeyWord,
    };
    const jsonData = JSON.stringify(data);
    this.callApiWithResponse("search", jsonData);
  }


  reload()
  {
    this.pathChange(this.currentPath);
  }

  async upload()
  {
    var files: File[] = [];
    var path = this.currentPath.fullTitle;
    if (this.fromcontext == true)
      path = this.pathFolderContextMenu.fullTitle;
    else if (this.fromFolder == true)
      path = this.selectedFolders.splice(this.selectedFolders.length - 1, 1)[0].VirtualPath;
    files = await this.dialogService.openUploadDialog(path);
    this.getPaths(this.currentPath);
  }


  async rename()
  {
    var newName: any;
    if (this.selectedFiles.length == 0 && this.selectedFolders.length == 0) return;
    if (this.selectedFiles.length > 0)
      newName = this.selectedFiles[0].FileName;
    else if (this.selectedFolders.length > 0)
      newName = this.selectedFolders[0].FolderName;

    newName = await this.dialogService.openRenameDialog(newName);
    if (newName != undefined)
    {
      var Items: string[] = [];
      this.selectedFiles.forEach(selectedFile =>
      {
        Items.push(this.currentPath.title + "\\" + selectedFile.FileName);
      });
      this.selectedFolders.forEach(selectedFile =>
      {
        Items.push(this.currentPath.title + "\\" + selectedFile.FolderName);
      });
      const data = {
        Path: this.currentPath.title,
        Items: Items,
        NewName: newName
      };
      const jsonData = JSON.stringify(data);
      this.callApiWithResponse("rename", jsonData);
      this.selectedFiles = [];
      this.selectedFolders = [];
    }

  }

  async delete()
  {

    const confirmed = await this.dialogService.openConfirmationDialog("آیا از حذف آیتم های انتخابی اطمینان دارید؟");
    if (confirmed)
    {

      var Items: string[] = [];
      if (this.fromcontext == true)
      {
        Items.push(this.pathFolderContextMenu.fullTitle);
      }
      for (let i = 0; i < this.selectedFolders.length; i++)
      {
        Items.push(this.selectedFolders[i].VirtualPath);
      }
      for (let i = 0; i < this.selectedFiles.length; i++)
      {
        Items.push(this.currentPath.fullTitle + "\\" + this.selectedFiles[i].FileName);
      }

      const data = {
        Path: this.currentPath.fullTitle,
        Items: Items,
      };

      if (this.fromcontext == true || this.selectedFolders.length > 0)
      {

        await this.callApi("delete", JSON.stringify(data));
        this.getPaths(this.currentPath);
      } else

        this.callApiWithResponse("delete", JSON.stringify(data));
    }
  }


  async download()
  {

    this.selectedFiles.forEach(selectedFile =>
    {
      this.service.downloadFile("download",
        (this.currentPath.fullTitle + "\\" + selectedFile.FileName)
      ).subscribe((response: Blob) =>
      {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = selectedFile.FileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }, error =>
      {
        console.error('File download error:', error);
      });
    });
  }


  blobs: fileBlob[] = [];

  async previews()
  {
    this.blobs = [];
    this.files.forEach(file =>
    {
      if (file.FileName.endsWith(".png"))
      {
        this.service.preview("filePreview",
          (file.VirtualPath)
        ).subscribe((response: Blob) =>
        {
          const fileURL = URL.createObjectURL(response);
          this.blobs.push({ file: file, content: fileURL });
        }, error =>
        {
          console.error('File download error:', error);
        });
      } else
      {
        this.blobs.push({ file: file, content: '' });

      }
    });
  }

  async preview()
  {
    this.blobs = [];
    this.files.forEach(file =>
    {
      if (file.FileName.endsWith(".png"))
      {
        this.service.preview("filePreview",
          (file.VirtualPath)
        ).subscribe((response: Blob) =>
        {
          const fileURL = URL.createObjectURL(response);
          this.blobs.push({ file: file, content: fileURL });
        }, error =>
        {
          console.error('File download error:', error);
        });
      } else
      {
        this.blobs.push({ file: file, content: '' });

      }
    });
  }

  callApi(command: string, parameters: string)
  {
    this.spinner.show();
    this.service.CallAPI(command, parameters).subscribe(
      response =>
      {
        this.getPaths(this.currentPath);
      },
      error =>
      {
        console.error('API error:', error);
      },
      () =>
      {
        this.spinner.hide();
      }
    );
  }

  callApiWithResponse(command: string, parameters: string)
  {
    this.spinner.show();
    this.service.CallAPI(command, parameters).subscribe(
      response =>
      {
        this.folders = response.Folders ?? [];
        this.files = response.Files ?? [];
        this.previews();
      },
      error =>
      {
        console.error('API error:', error);
      },
    ).add(() =>
    {
      this.spinner.hide();
    });
  }

  selectedFileChanged(event: any, currentFile: file)
  {
    this.fromContext = false;
    if (event != undefined && event.ctrlKey)
      this.selectedFiles.push(currentFile);
    else
    {
      this.selectedFiles = [];
      this.selectedFolders = [];
      this.selectedFiles.push(currentFile);
    }
  }

  isFileInSelectedFiles(currentFile: file): boolean
  {
    return this.selectedFiles.includes(currentFile);
  }

  clickTimer: any;

  clickCount = 0;
  onFileClick(event: MouseEvent, file: file)
  {
    this.clickCount++;
    setTimeout(() =>
    {
      if (this.clickCount === 1)
      {
        if (this.clickTimer)
        {
          this.fromContext = false;
          clearTimeout(this.clickTimer);
          this.clickTimer = null;
        } else
        {
          this.clickTimer = setTimeout(() =>
          {
            this.selectedFileChanged(event, file);
            this.clickTimer = null;
            this.clickTimer = null;
          }, 250);
        }
      } else if (this.clickCount === 2)
      {
        console.log('double click');
      }
      this.clickCount = 0;
    }, 250);
  }


  onFolderClick(event: MouseEvent, file: folder)
  {
    if (this.clickTimer)
    {
      this.fromContext = false;
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      this.doubleClick(file);
    } else
    {
      this.clickTimer = setTimeout(() =>
      {
        this.selectedFolderChanged(event, file);
        this.clickTimer = null;
        this.clickTimer = null;
      }, 250);
    }
  }

  selectedFolderChanged(event: any, currentFile: folder)
  {
    this.fromContext = false;
    if (event != undefined && event.ctrlKey)
      this.selectedFolders.push(currentFile);
    else
    {
      this.selectedFolders = [];
      this.selectedFiles = [];
      this.selectedFolders.push(currentFile);
    }
  }

  isFolderInSelectedFiles(file: folder): boolean
  {
    return this.selectedFolders.includes(file);
  }

  @ViewChild('resizableDiv1', { static: false }) resizableDiv1!: ElementRef;
  @ViewChild('resizableDiv2', { static: false }) resizableDiv2!: ElementRef;
  @ViewChild('resizableContainer', { static: false }) resizableContainer!: ElementRef;

  isResizing = false;
  lastDownX = 0;
  originalWidth1 = 0;
  originalWidth2 = 0;

  onMouseDown(event: MouseEvent, direction: 'left' | 'right')
  {
    this.isResizing = true;
    this.lastDownX = event.clientX;
    this.originalWidth1 = this.resizableDiv1.nativeElement.offsetWidth;
    this.originalWidth2 = this.resizableDiv2.nativeElement.offsetWidth;

    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent)
  {
    if (!this.isResizing) return;

    const offsetX = event.clientX - this.lastDownX;

    this.resizableDiv1.nativeElement.style.width = ` ${ this.originalWidth1 + offsetX }px`;
    this.resizableDiv2.nativeElement.style.width = this.resizableContainer.nativeElement.offsetWidth - this.resizableDiv1.nativeElement.offsetWidth - 10 + 'px';
  }

  @HostListener('document:mouseup')
  onMouseUp()
  {
    this.isResizing = false;
  }

  @HostListener('window:resize', ['$event'])
  windowsResize()
  {
    this.resizableDiv2.nativeElement.style.width = this.resizableContainer.nativeElement.offsetWidth - this.resizableDiv1.nativeElement.offsetWidth - 10 + 'px';
  }

  @ViewChild(FileContextMenuComponent) contextMenu!: FileContextMenuComponent;

  onContextMenu(event: MouseEvent, from: string)
  {
    if (event != undefined)
      event.preventDefault();

    if (this.fromFile)
    {
      this.fromFile = false;
      return;
    }
    this.contextMenu.show(event, from);
    this.ShowFileMenu = from == "file";
    this.ShowTreeMenu = from == "tree";
    this.showEmptyArea = from == "emptyArea";

    this.selectedFiles = [];
    this.selectedFolders = [];
  }

  ShowFileMenu: boolean = false;
  ShowTreeMenu: boolean = false;
  showEmptyArea: boolean = false;
  fromFile: boolean = false;
  fromFolder: boolean = false;

  onFileContextMenu(event: MouseEvent, currentFile: any)
  {
    event.preventDefault();
    this.fromFile = true;
    this.fromFolder = false;
    this.selectedFileChanged(undefined, currentFile);
    this.contextMenu.show(event, "file");
  }

  onFolderContextMenu(event: MouseEvent, currentFile: any)
  {
    event.preventDefault();
    this.fromFolder = true;
    this.fromFile = true;
    this.selectedFolderChanged(undefined, currentFile);
    this.contextMenu.show(event, "file");
  }

  backButtonEnable: boolean = true;

  get upButtonEnable(): boolean
  {
    return this.currentPath.parent == undefined || this.currentPath.parent == '';
  }

  @ViewChild(FileContextMenuComponent, { static: false }) fileMenu!: FileContextMenuComponent;

  onDivClick(event: any)
  {
    if (this.fileMenu != undefined)
      this.fileMenu.hide();
    if (event != undefined && event.ctrlKey)
      return;
    this.selectedFiles = [];
    this.selectedFolders = [];
  }


  doubleClick(file: folder)
  {
    if (this.currentPath.childs.find(x => x.title == file.FolderName) != undefined)
      this.pathChange(this.currentPath.childs.find(x => x.title == file.FolderName) ?? this.currentPath);
  }

  getContainerWidth(): number | undefined
  {
    return document.getElementById("files-container")?.offsetWidth;
  }
}
