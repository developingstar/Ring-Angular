import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrizesService } from '../../_services/prizes.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-prizesindex',
  templateUrl: './prizesindex.component.html',
  styleUrls: ['./prizesindex.component.scss']
})
export class PrizesIndexComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  private infiniteScrollLoading: boolean;
  private prizes: Array<Model.Prize>; // We need to pass this as a input to prizes-table Module
  private limit: number;
  private offset: number;
  private searchText: string;

  constructor(private router: Router, private prizesService: PrizesService) { }

  ngOnInit() {
    this.prizes = new Array<Model.Prize>();
    this.limit = 50;
    this.offset = 0;
    this.getPrizes();
  }

  editPrize(id) {
    this.router.navigate(['prizeedit/' + id]);
  }

  searchItems(event): void {    
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getPrizes();         
  }

  getPrizes(): void {
    this.prizesService.getPrizes(this.offset, this.searchText).subscribe((res) => {
      this.prizes = res.map(prize => prize);
      this.offset += res.length;      
    }, (errors) => {
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;      
      return this.prizesService.getPrizes(this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(prize => {
      this.prizes.push(prize);      
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }
}
