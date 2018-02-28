import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { error } from 'util';
import { MultiSelectService, UsersService } from '../../app.services-list';
import { Model } from '../../app.models-list';
import { MultiSelectUtil } from '../../_utils/multiselect.util';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.scss']
})
export class UserAddComponent implements OnInit { 
  private user: Model.User; 
  private originalUser: Model.User;
  private title: string;
  private organizationTitle: string;
  private editFlag: boolean;
  private disableFlag: boolean;
  private schoolList = [];
  private sponsorList = [];
  private organizationList = [];
  private selectedOrganization = [];
  private typeList = [];
  private selectedType = [];
  private ktsSelectSettings = {};

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private usersService: UsersService,
              private multiSelectService: MultiSelectService) { }

  ngOnInit() { 
    this.title = 'New User';
    this.organizationTitle = 'School';
    this.user = new Model.User({});        
    this.editFlag = false;
    this.disableFlag = false;
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;    
    this.typeList.push({itemName: 'Student', id: 'student'});
    this.typeList.push({itemName: 'Key Contact', id: 'key_contact'});
    this.typeList.push({itemName: 'Counselor', id: 'counselor'});
    this.typeList.push({itemName: 'Business Owner', id: 'business_owner'});

    const id = this.route.snapshot.paramMap.get('userId');
    if (id !== null) {
      this.title = 'Edit User';
      this.editFlag = true;
      this.disableFlag = true;
      this.getUser(id);
    }
    this.getSchools();
    this.getSponsors();
  }

  onSchoolSelect(item: any) {
    this.user.organization_id = item.id;    
    this.onChange(item);
  }

  onSchoolDeSelect(item: any) {
    this.onChange(item);
  }

  onTypeSelect(item: any) {
    this.user.type = item.id; 
    this.changeOrganizationList();       
    this.onChange(item);
  }

  onTypeDeSelect(item: any) {
    this.changeOrganizationList();
    this.onChange(item);
  }

  goBack(event): void {
    this.router.navigate(['users']);
  }

  getUser(id): void {
    this.usersService.getUser(id).subscribe( (res) => {          
      this.user = res;
      this.user.type = 'key_contact';
      this.user.password = 'password';
      this.originalUser = Object.assign({}, this.user);                  
      if (this.schoolList.length > 0) {
        let org = this.schoolList.find(organization => organization.id === parseInt(this.user.organization_id, 0));
        if (org) {
          this.selectedOrganization.push(org);
        }
      }
      let userType = this.typeList.find(type => type.id === this.user.type);
      if (userType) {
        this.selectedType.push(userType);
      }
    }, (errors) => {      
      alert('Server error');
    });
  }

  onChange(event): void {
    if (this.editFlag) {      
      if (this.user.first_name !== this.originalUser.first_name) {
        this.disableFlag = false;
        return;
      }      
      
      if (this.user.last_name !== this.originalUser.last_name) {
        this.disableFlag = false;
        return;
      }
      
      if (this.selectedOrganization.length === 0) {
        this.disableFlag = false;        
        return;
      } else if (this.selectedOrganization[0].id !== this.originalUser.organization_id) {
        this.disableFlag = false;        
        return;
      }
      
      if (this.selectedType.length === 0) {
        this.disableFlag = false;
        return;
      } else if (this.selectedType[0].id !== this.originalUser.type) {
        this.disableFlag = false;
        return;
      }
      
      if (this.user.email !== this.originalUser.email) {
        this.disableFlag = false;
        return;
      }

      if (this.user.password !== this.originalUser.password) {
        this.disableFlag = false;
        return;
      }

      this.disableFlag = true;
    } else {
      this.disableFlag = false;
    }
  }

  saveUser(valid): void { 
    if (!valid) {
      return;
    } 
    
    if (this.selectedOrganization.length === 0 || this.selectedType.length === 0) {
      return;
    }    
    this.user.organization_id = this.selectedOrganization[0].id;
    if (!this.user.roles) {
      this.user.roles = [];
      this.user.roles.push(this.selectedType[0].id);
    } else {
      this.user.roles.push(this.selectedType[0].id);
    }
    
    if (!this.user.id) {      
      this.usersService.createUser(this.user).subscribe( (res) => {            
        alert('User is created');          
        this.router.navigate(['users']);       
      }, (errors) => {      
        alert(errors.message);
      });
    } else { 
      let updatedUser = Object.assign({}, this.user);
      delete updatedUser.password;             
      this.usersService.updateUser(updatedUser).subscribe( (res) => {            
        alert('User is updated');          
        this.router.navigate(['users']);       
      }, (errors) => {      
        alert(errors.message);
      });             
    }
  }

  getSchools(): void {
    this.multiSelectService.getDropdownSchools().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.schoolList = res;      
      if (this.editFlag && this.user.organization_id && this.schoolList.length > 0) {        
        let org = this.schoolList.find(organization => organization.id === parseInt(this.user.organization_id, 0));                
        if (org) {
          this.selectedOrganization.push(org);
        }
      }
      this.changeOrganizationList();
    }, err => {
      console.log('err', err);
    });
  }

  getSponsors(): void {
    this.multiSelectService.getDropdownSponsors().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.sponsorList = res;      
      if (this.editFlag && this.user.organization_id && this.sponsorList.length > 0) {        
        let org = this.sponsorList.find(organization => organization.id === parseInt(this.user.organization_id, 0));                
        if (org) {
          this.selectedOrganization.push(org);
        }
      }
      this.changeOrganizationList();      
    }, err => {
      console.log('err', err);
    });
  }

  changeOrganizationList(): void {
    if (this.selectedType.length > 0 && this.selectedType[0].id === 'business_owner') {
      this.organizationTitle = 'Organization';
      this.organizationList = this.sponsorList.map(sponsor => sponsor);      
    } else {
      this.organizationTitle = 'School';
      this.organizationList = this.schoolList.map(school => school);
    }
    this.selectedOrganization = [];
  }

  validEmail(email: string): boolean {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  }
}
