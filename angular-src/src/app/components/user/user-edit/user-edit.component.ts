import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//import service
import { AuthService } from '../../../services/auth.service';
import { ValidateService } from '../../../services/validate.service';
import { SeoService } from '../../../services/seo.service';
import { DataService } from '../../../services/data.service';
//router to redirect
import { Router } from '@angular/router';
import { Regions } from '../../../models/regions';

//import angular forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  name: String;
  email: String;
  email2: String;
  password: String;
  password2: String;
  user: any;
  location: String[] = [];
  regionsList: Regions[];
  regions: string[];

  //form
  form = new FormGroup({
    name: new FormControl('', Validators.minLength(2)),
    email: new FormControl('', Validators.required),
  });

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private toastr: ToastrService,
    private seoService: SeoService,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
    //metadata manipulation
    this.seoService.setSectionMetadata('Edit Profile Information');

    //use data service to query all ESRegions
    this.regionsList = this.dataService.getRegions();

    //get only the name attribute of ESRegions
    this.regions = this.getName(this.regionsList);

    //render page
    this.renderPage()

  };

  //get all the Name attribute from data service ESRegions
  getName(data) {
    var standardName = [];
    for (var i = 0; i < data.length; i++) {
      standardName.push(data[i].standardName);
    }
    return standardName;
  };


  //add item to location list
  onItemAdded(a) {
    this.location.push(a.display)
  };

  //remove item from location list
  onItemRemoved(a) {
    //if removing a pre-existing item then select as it is
    if (a.length > 1) {
      var x = a
    } else {
      //if removing a new item then select the .display attribute
      var x = a.display
    }
    //remove item from array
    for (var i = this.location.length - 1; i >= 0; i--) {
      if (this.location[i] === x) {
        this.location.splice(i, 1);
      }
    }
  };

  //edit name
  onClickEditName() {
    const name = {
      name: this.name
    };
    //http call to edit name
    this.authService.editName(name).subscribe(data => {
      if (data["success"]) {
        this.toastr.success('User name changed', '', {
          timeOut: 3000
        });
        //re-render page
        this.renderPage();
      } else {
        this.onError()
        window.scrollTo(0, 0);
      }
    });
  };

  //edit location
  onClickEditLocation() {
    //if location array is empty
    if (!this.location) {
      //if no location selected then by default select All
      this.location = undefined

      /*
      this.toastr.warning('Por favor seleccione al menos una ubicación', '', {
        timeOut: 3000
      });
      */

      //save location to localstorage
      localStorage.setItem('locations', JSON.stringify(this.location));

    } else {
      //if location(s) selected

      //define location
      const location = {
        location: this.location
      };

      //http call to edit location
      this.authService.editLocation(location).subscribe(data => {
        if (data["success"]) {
          this.toastr.success('Location filter changed', '', {
            timeOut: 3000
          });

          //save to localstorage
          localStorage.setItem('locations', JSON.stringify(this.location));

          //re-render page
          this.renderPage();

        } else {
          this.onError()
          window.scrollTo(0, 0);
        }
      })
    };
  };

  //edit email
  onClickEditEmail() {
    if (!this.validateService.emailMatch(this.email, this.email2)) {
      this.toastr.warning('Emails do not match', '', {
        timeOut: 3000
      });
      window.scrollTo(0, 0);
      return false;
    }

    //defined email
    const email = {
      email: this.email
    };
    //http call to edit email
    this.authService.editEmail(email).subscribe(data => {
      if (data["success"]) {
        this.toastr.success('Email changed', '', {
          timeOut: 3000
        });
        //re-render page
        this.renderPage();
      } else {
        this.onError()
        window.scrollTo(0, 0);
      }
    });
  };

  //edit password
  onClickEditPassword() {
    if (!this.validateService.passwordMatch(this.password, this.password2)) {
      this.toastr.warning('Password do not match', '', {
        timeOut: 3000
      });
      window.scrollTo(0, 0);
      return false;
    }

    const password = {
      password: this.password
    };
    //edit email
    this.authService.editPassword(password).subscribe(data => {
      if (data["success"]) {
        this.toastr.success('Password changed', '', {
          timeOut: 3000
        });
      } else {
        this.onError()
        window.scrollTo(0, 0);
      }
    });

  };


  onClickDisactivateAccount() {

    this.authService.disactivateUser().subscribe(data => {
      if (data["success"]) {

        this.toastr.success('Account Deleted', '', {
          timeOut: 5000
        });

        this.authService.logout();

        this.router.navigate(['/']);

      } else {

        this.onError()
        window.scrollTo(0, 0);

      }
    });

  }


  renderPage() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile["user"];

      //pre-fill form
      this.form.get("name").setValue(this.user.name);
      this.form.get("email").setValue(this.user.email);

      this.location = this.user.location;

    },
      err => {
        //console.log(err);
        return false;
      });
  };

  onError() {
    this.toastr.error('Error: please try again later or contact us', '', {
      timeOut: 3000
    });
  }
}
