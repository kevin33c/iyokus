import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../services/seo.service';
import { UserService } from '../../../services/user.service';

//router to redirect
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  message: string;

  constructor(
    private seoService: SeoService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {    
    this.seoService.setSectionMetadata('Contact Us');
  }


  onSendMessage() {

    var msg = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phonenumber: this.phonenumber,
      message: this.message,
    };

    //send contact us email to admin
    this.userService.contactUs(msg).subscribe(data => {
      if (data["success"]) {

        this.router.navigate(['/'])

        this.toastr.success("Message sent. We'll reply to your inquiry as soon as possible", '', {
          timeOut: 4000
        });

      } else {
        this.toastr.error('Error: please try again later', '', {
          timeOut: 3000
        });
      }
    })

  }
}
