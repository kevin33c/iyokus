import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

//import service
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { ValidateService } from '../../../services/validate.service';
import { WebsocketService } from '../../../services/websocket.service'

import { Category } from '../../../models/category';
import { Subcategory } from '../../../models/subcategory';
import { ProductsService } from '../../../services/products.service';

//router to redirect
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //user sign up and log in forms
  type: String = 'user';

  user: Object;
  key: String;
  searches: any;
  email: String;
  password: String;
  name: String;
  signupEmail: String;
  signupEmail2: String;
  sigupPassword: String;
  sigupPassword2: String;
  changePWEmail: String;
  reVerifyEmail: String;
  unreadMessages: number;
  isMobile: boolean = false;

  categories: Category[];
  subcategories: Subcategory[];

  constructor(
    private productsService: ProductsService,
    public authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService,
    private validateService: ValidateService,
    private websocketService: WebsocketService,
  ) { }

  ngOnInit() {
    /*Re-render page when changing url params*/
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
    /*Re-render page when changing url params*/

    if (this.authService.loggedIn()) {
      //check unread conversations
      this.websocketService.checkUnreadConversation().subscribe(data => {

        if (data['found']) {
          this.unreadMessages = data['count'];
        };

      });
    };

    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      this.isMobile = true;
    }

    this.categories = this.dataService.getCategory();

  };


  onSearch() {
    if (this.key.length >= 2) {
      this.productsService.getSearches(this.key).subscribe(data => {
        this.searches = data;
        if (this.searches.length < 1) {
          this.searches = null
        }
      });
    } else {
      this.searches = null
    };
  };

  onSelectKeyword(key) {

    this.key = key

    if (this.key) {
      /*Re-render page when changing url params*/
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };

      this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
          this.router.navigated = false;
          window.scrollTo(0, 0);
        }
      });
      /*Re-render page when changing url params*/
      //nagivate to search page
      this.router.navigate(['/view/search'], { queryParams: { key: this.key } });

    };

  };

  onLogoutClick() {

    this.authService.logout();

    window.location.reload();

    this.toastr.info('Signed out successfully', '', {
      timeOut: 3000
    });
  };

  onSelect(categoryID) {
    this.subcategories = this.dataService.getSubcategory().filter((item) => item.categoryID == categoryID);
  };


  onClickSearch() {
    if (this.key) {
      /*Re-render page when changing url params*/
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };

      this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
          this.router.navigated = false;
          window.scrollTo(0, 0);
        }
      });
      /*Re-render page when changing url params*/

      //nagivate to search page
      this.router.navigate(['/view/search'], { queryParams: { key: this.key } });
    };
  };

  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password,
      type: this.type
    };

    this.authService.authenticateUser(user).subscribe(data => {

      this.resetVariables()

      if (data["success"]) {

        //save data in local storage
        this.authService.storeUserData(data["token"], data["user"])

        //window.location.reload();

        this.toastr.success('Signed in successfully', '', {
          timeOut: 3000
        });

      } else {

        this.toastr.error(data["msg"], '', {
          timeOut: 3000
        });

      };
    });
  };


  onRegisterSubmit() {

    const user = {
      name: this.name,
      email: this.signupEmail,
      password: this.sigupPassword,
      type: this.type,
    };

    //validate
    if (!this.validateService.validateRegister(user)) {
      this.toastr.warning('Please fill out all required information', '', {
        timeOut: 3000
      });
      return false;
    };

    if (!this.validateService.validateEmail(user.email)) {
      this.toastr.warning('Please enter a valid email', '', {
        timeOut: 3000
      });
      return false;
    };

    if (!this.validateService.emailMatch(this.signupEmail, this.signupEmail2)) {
      this.toastr.warning('Emails do not match', '', {
        timeOut: 3000
      });
      return false;
    };

    if (!this.validateService.passwordMatch(this.sigupPassword, this.sigupPassword2)) {
      this.toastr.warning('Passwords do not match', '', {
        timeOut: 3000
      });
      return false;
    };

    this.spinnerService.show();

    //http register user
    this.authService.registerUser(user).subscribe(data => {

      this.resetVariables();
      this.spinnerService.hide();

      if (data["success"]) {

        this.toastr.success('We have sent you an email to verify your account, please verify before sign in', '', {
          timeOut: 3000
        });

      } else {

        this.toastr.error('Error: Email already exists', '', {
          timeOut: 3000
        });

      };
    })
  };


  onSubmitChangePW() {
    this.spinnerService.show();

    const user = {
      email: this.changePWEmail,
      type: this.type,
      purpose: 'password'
    };

    this.authService.getTempToken(user).subscribe(data => {

      this.spinnerService.hide();

      if (data["success"]) {

        this.toastr.success('We have sent you an email to reset your password', '', {
          timeOut: 3000
        });

      } else {

        this.toastr.error('Email not registered', '', {
          timeOut: 3000
        });

      };
    })
  };


  onSubmitReverifyEmail() {

    this.spinnerService.show();

    const user = {
      email: this.reVerifyEmail,
      type: this.type,
      purpose: 'email'
    };

    this.authService.getTempToken(user).subscribe(data => {

      this.spinnerService.hide();

      if (data["success"]) {

        this.toastr.success('We have sent your an email to re-verify your account', '', {
          timeOut: 3000
        });

      } else {

        this.toastr.error('Email not registered', '', {
          timeOut: 3000
        });

      };
    })
  };


  goTop() {
    window.scrollTo(0, 0);
  }


  resetVariables() {
    this.email = undefined;
    this.password = undefined;
    this.name = undefined;
    this.signupEmail = undefined;
    this.signupEmail2 = undefined;
    this.sigupPassword = undefined;
    this.sigupPassword2 = undefined;
  };

}
