import 'rxjs/add/observable/throw';
import * as moment from 'moment';
import { Component, OnInit, TemplateRef, Input} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { error } from 'util';
import { PrizesService } from '../../../../app.services-list';
import { Model } from '../../../../app.models-list';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {    
  @Input() prizeId;
  @Input() campaigns;
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };
  modalType: number;
  modalTitle: string;
  campaignId: number;
  startDate: Date = new Date();
  endDate: Date = new Date();
  minDate: Date = new Date();  
  quantity: string;
  redeemed: string;
  constructor(private prizesService: PrizesService, 
              private modalService: BsModalService) { }

  ngOnInit() {      
    this.modalType = 0;
    this.modalTitle = 'New Campaign';        
  } 

  openModal(template: TemplateRef<any>, index: number = -1): void {
    this.modalRef = this.modalService.show(template, this.config);
    this.campaignId = index === -1 ? 0 : this.campaigns[index].id;    
    if (this.campaignId === 0) {
      this.modalTitle = 'New Campaign';  
      this.startDate = new Date();    
      this.endDate = new Date();
      this.quantity = '';      
    } else {
      this.modalTitle = 'Edit Campaign';      
      this.startDate = new Date(this.campaigns[index].activation_start);    
      this.endDate = new Date(this.campaigns[index].activation_end);
      this.quantity = this.campaigns[index].number_available;
      this.redeemed = '';
    }   
  }

  formatDate(date: any): string {
    return date ? moment(date, moment.ISO_8601)
      .format('DD  MMM  YYYY') : '';    
  }
  
  saveCampaign(valid): void {    
    if (!valid) {
      return;
    }
    if (!this.startDate || !this.endDate) {
      return;
    }
    
    let newCampaign = {      
      activation_start: this.startDate,
      activation_end: this.endDate,
      number_available: this.quantity,
      release_dates: [{activation_start: this.startDate, activation_end: this.endDate}]            
    };
    
    if (this.campaignId === 0) {      
      this.prizesService.createCampaign(this.prizeId, new Model.Campaign(newCampaign)).subscribe( (res) => {                 
        alert('Campaign is created');          
        this.campaigns.push(res);
        this.modalRef.hide();
      }, (errors) => {              
        alert(errors.message);
      });
    }
  }
}
