import {Component, OnInit} from '@angular/core';
import {ICircle} from "../interfaces/circle.interface";
import {ECircleCount} from "../enums/circle-count.enum";
import {LocalStorageService} from "../services/storage.service";
import {IProject} from "../interfaces/project.interface";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  generateIsDisabled: boolean = true
  saveIsDisabled: boolean = false
  fillIsDisabled: boolean = true
  resetIsDisabled: boolean = true
  circles: ICircle[] = [];
  projectName: string = '';
  projectList: IProject[] = [];
  projectListName = 'circlesProject';
  canvasSizes: number[] = [
    ECircleCount.MIN, // 100
    ECircleCount.MID, // 225
    ECircleCount.MAX, // 400
  ];
  selectedSize: number = this.canvasSizes[0];
  currentColor: string = '#000';

  constructor(private storage: LocalStorageService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  onSizeSelect(): void {
    this.circles = [];
  }

  onCircleClick(circle: ICircle): void {
    this.resetIsDisabled = false
    this.fillIsDisabled = false
    if(this.circles[circle.id].color.length) {
      this.circles[circle.id].color = ""
    } else {
      this.circles[circle.id].color = this.currentColor;
    }
  }

  onResetColor(): void {
    if (!this.isEmpty(this.circles)) {
      this.resetColors();
    }
    this.resetIsDisabled = true
    this.fillIsDisabled = false
  }

  resetColors(): void {
    this.circles = [];
    for (let i = 0; i < this.selectedSize; i++) {
      this.circles.push({
        id: i,
        uid: this.newId(),
        color: '',
      });
    }
  }

  onFillCircles(): void {
    this.fillIsDisabled = true
    this.resetIsDisabled = false
       if (this.isEmpty(this.circles)) {
      return;
    }
    this.circles.forEach((item) => {
      item.color = this.currentColor;
    })
  }

  isEmpty(arr: ICircle[]): boolean {
    return !arr.length;
  }

  newId(): string {
    return String(Date.now());
  }

  onSave(): void {
    this.generateIsDisabled = false
    this.fillIsDisabled = false
    if (!this.projectName) {

      return;
    }
    this.circles = []
    for (let i = 0; i < this.selectedSize; i++) {
      this.circles.push({
        id: i,
        uid: this.newId(),
        color: '',
      });
    }
      this.projectList.push({
        id: this.newId(),
        name: this.projectName,
        circles: this.circles,
      })


    const projectsStr = JSON.stringify(this.projectList);
    this.storage.set(this.projectListName, projectsStr);
  }

  getProjects(): void {
    const projects = this.storage.get(this.projectListName);
    if (projects) {
      this.projectList = JSON.parse(projects);
    }
  }

  selectProject(project: IProject): void {
    if(project.circles.length === 100){
      this.selectedSize = this.canvasSizes[0];
    }
    else if(project.circles.length === 225){
      this.selectedSize = this.canvasSizes[1];
    }
    else{
      this.selectedSize = this.canvasSizes[2];
    }


    this.circles = project.circles;
  }
  onDeleteProject(index: number) : void {
    this.projectList.splice(index,index+1)
    localStorage.setItem(this.projectListName, JSON.stringify(this.projectList))
  }
  onDeleteAll() : void {
    localStorage.clear()
    this.projectList.splice(0, 1000)
  }
}
