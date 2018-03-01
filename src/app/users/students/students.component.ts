import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { ResourcesService } from '../../_services/resources.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public students: Array<Model.User>;
  public organizations: Array<Model.Organization>;

  constructor(private usersService: UsersService,
    resourcesService: ResourcesService) { }

  ngOnInit() {
    this.students = new Array<Model.User>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.getStudents();
  }

  editStudent(id) {
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getStudents();
  }

  getStudents(): void {
    this.usersService.getUsers('student', this.offset, this.searchText).subscribe((res) => {
      this.students = res.map(student => student);
      this.offset += res.length;
    }, (errors) => {
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.usersService.getUsers('student', this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(student => {
      this.students.push(student);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }
}
