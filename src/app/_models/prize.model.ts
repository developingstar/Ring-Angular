import * as moment from 'moment';
import { Campaign } from './campaign.model';

export class Prize {
  id: string;
  title: string;
  points: number;
  details: string;
  delivery_type: string;
  sponsor: string;
  sponsor_id: string;
  images: Array<string>;  
  prize_campaigns: Array<Campaign>;  
  created_at: any;
  updated_at: any;
  deleted_at: any;
  
  constructor(data) {         
    this.setData(data);
  }

  setData(data) {    
    this.id = data.id || this.id;
    this.title = data.title || this.title;
    this.details = data.details || this.details;
    this.delivery_type = data.delivery_type || this.delivery_type;
    this.sponsor = data.sponsor || this.sponsor;
    this.sponsor_id = data.sponsor_id || this.sponsor_id;
    this.points = data.points || this.points;
    this.images = data.images || this.images;    
    this.prize_campaigns = data.prize_campaigns || this.prize_campaigns;
    this.created_at = data.created_at ? moment(data.created_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.updated_at = data.updated_at ? moment(data.updated_at, moment.ISO_8601)
      .format('DD  MMM  YYYY') : moment(new Date(), moment.ISO_8601)
        .format('DD  MMM  YYYY');
    this.deleted_at = data.deleted_at ? moment(data.deleted_at, moment.ISO_8601)
    .format('DD  MMM  YYYY') : null;
  }
}
