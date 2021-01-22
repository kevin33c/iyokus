import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

//import services
import { ProductsService } from '../../../services/products.service';
import { ValidateService } from '../../../services/validate.service';
import { SeoService } from '../../../services/seo.service';
import { ScriptService } from '../../../services/script.service';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';

import { Category } from '../../../models/category';
import { Subcategory } from '../../../models/subcategory';
//import angular forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';



@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {


  selectedFile: File;
  selectedFileName: String = 'Select file';
  //ckeditor
  ckeConfig: any;

  //product interface
  _id: String;
  name: String;
  type: number;
  brand: String;
  category: string;
  subcategory: string;
  gender: number;
  description: String;
  listed_price: Number;
  reserve_price: Number;
  quantity: Number;
  image_Main: String;
  image_1: String;
  image_2: String;
  image_3: String;
  return_policy: any;
  locked_period: Number;
  tags: String[] = [];
  variant1: String[] = [];
  variant2: String[] = [];
  condition: Number;
  currency: String = 'GBP';
  location: String[];
  deliveryMethod: number;
  deliveryCost: Number;
  isReferenced: boolean;
  isInternational: boolean;
  isVariant: boolean;
  referenceURL: string;
  referenceID: string;
  isFreeDelivery: boolean;
  data: any;

  //output
  product: any;

  //get product ID from url
  productID: String

  //set image upload path
  imagePath: String = 'https://woolime.s3.eu-west-3.amazonaws.com/';

  user: any;

  //image uploaded list
  selectedFiles: [FileList];

  //to view images name
  public files: String[] = [];
  //to load images to S3
  public fileSources: String[] = [];

  categories: Category[];
  subcategories: Subcategory[];

  //form
  form = new FormGroup({
    referenceURL: new FormControl(''),
    referenceID: new FormControl(''),
    name: new FormControl('', Validators.minLength(10)),
    type: new FormControl('', Validators.required),
    condition: new FormControl(''),
    brand: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    gender: new FormControl(''),
    description: new FormControl('', Validators.minLength(10)),
    listed_price: new FormControl('', Validators.required),
    reserve_price: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    locked_period: new FormControl('', Validators.required),
    currency: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    deliveryMethod: new FormControl('', Validators.required),
    deliveryCost: new FormControl(''),
    return_policy: new FormControl('', Validators.required),
  });


  constructor(
    private authService: AuthService,
    private productsService: ProductsService,
    private validateService: ValidateService,
    private router: Router,
    public fb: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService,
    private seoService: SeoService,
    private scriptService: ScriptService,
    private dataService: DataService,
  ) { }

  ngOnInit() {

    this.dataService.currentMessage.subscribe(message => {
      this.data = message;
    })

    //load CKeditor script
    this.scriptService.loadScript('https://cdn.ckeditor.com/4.7.0/full-all/ckeditor.js');

    this.seoService.setSectionMetadata('Edit Product');

    //ckeditor
    this.ckeConfig = {
      height: 300,
      language: "en",
      allowedContent: true,
      extraPlugins: "divarea",
      toolbar: [
        { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Subscript", "Superscript"] },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
        { name: "styles", items: ["Format", "FontSize"] }
      ]
    };

    //get _id from url
    const id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    //add if productID not found then error
    this.productsService.getProduct(id).subscribe(data => {
      //assign product info
      this.product = data;

      //check if data retrieve successful
      if (this.product.success == false) {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
        this.router.navigate(['/business/viewproduct']);
        window.scrollTo(0, 0);
        return;

      } else {
        //get product _id
        this._id = this.product._id;

        //get productID
        this.productID = this.product.productID;
        this.isInternational = this.product.isInternational;
        this.isReferenced = this.product.isReferenced;
        this.isVariant = this.product.isVariant;
        this.isFreeDelivery = this.product.isFreeDelivery;

        //this.initSucategory(this.product.category);

        //pre-fill form
        this.form.get("referenceURL").setValue(this.product.referenceURL);
        this.form.get("referenceID").setValue(this.product.referenceID);
        this.form.get("name").setValue(this.product.name);
        this.form.get("type").setValue(this.product.type);
        this.form.get("condition").setValue(this.product.condition);
        this.form.get("brand").setValue(this.product.brand);
        this.form.get("category").setValue(this.product.category);
        this.form.get("subcategory").setValue(this.product.subcategory);
        this.form.get("gender").setValue(this.product.gender);
        this.form.get("description").setValue(this.product.description);
        this.form.get("listed_price").setValue(this.product.listed_price);
        this.form.get("reserve_price").setValue(this.product.reserve_price);
        this.form.get("quantity").setValue(this.product.quantity);
        this.form.get("locked_period").setValue(this.product.locked_period);
        this.form.get("currency").setValue(this.product.currency.toUpperCase());
        this.form.get("location").setValue(this.product.location);
        this.form.get("deliveryMethod").setValue(this.product.deliveryMethod);
        this.form.get("deliveryCost").setValue(this.product.deliveryCost);
        this.form.get("return_policy").setValue(this.product.return_policy);
        //tags
        this.tags = this.product.tags;
        this.variant1 = this.product.variant1;
        this.variant2 = this.product.variant2;

        //set images to array
        this.fileSources = [
          this.product.image_3,
          this.product.image_2,
          this.product.image_1,
          this.product.image_Main
        ]

        //delete undefined path from array
        this.fileSources = this.fileSources.filter(function (e) { return e });
      }
    })

    this.authService.getProfile().subscribe(profile => {
      this.user = profile["user"];
    }
    );

    //load product categories
    this.categories = this.dataService.getCategory();
    this.subcategories = this.dataService.getSubcategory().filter((item) => item.categoryID == Number(this.data.category));

  };


  onSelectCondition() {
    this.condition = undefined;

    if (this.type == 1) {

      this.return_policy = 14;

    } else if (this.type == 0) {

      this.return_policy = 0;

    }
  };

  onSelectDeliveryMethod() {
    this.deliveryCost = 0;
  };

  /*
  initSucategory(categoryID) {
    //display the subcategory for the category selected
    this.subcategories = this.dataService.getSubcategory().filter((item) => item.categoryID == categoryID);
    this.subcategory = this.product.subcategory;
    console.log(this.subcategory);
  };
  */


  onSelect(categoryID) {
    //if category change then reset gender and subcategory selection
    this.gender = undefined
    this.subcategory = undefined
    //display the subcategory for the category selected
    this.subcategories = this.dataService.getSubcategory().filter((item) => item.categoryID == categoryID);
  };

  /***************************************FILE UPLOAD************************************/
  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
    this.selectedFileName = this.selectedFile.name
  };

  onUpload() {
    if (this.selectedFile === undefined) {
      this.toastr.error('Please upload at least 1 picture', '', {
        timeOut: 3000
      });
    } else {
      this.spinnerService.show();
      //upload image
      this.productsService.fileUpload(this.selectedFile).subscribe(data => {
        //add image path to product
        if (data['error']) {
          //if error
          this.toastr.error('Error: picture too large or in wrong format', '', {
            timeOut: 3000
          });
          this.spinnerService.hide();
        } else {
          this.toastr.success('Picture correctly uploaded', '', {
            timeOut: 3000
          });
          //if success
          this.fileSources.push(data['location']);
          //reset selectedFile value
          this.selectedFile = undefined;
          this.selectedFileName = 'Select file';
          this.spinnerService.hide();
        }

      })
    }
  };
  /***************************************FILE UPLOAD************************************/

  /***************************************TAGS************************************/
  onItemAdded(a, p) {
    var x = this.toUpperCase(a.display);
    if (p == 'tag') {
      this.tags.push(x);
    } else if (p == 'variant1') {
      this.variant1.push(x);
    } else if (p == 'variant2') {
      this.variant2.push(x);
    } else {
      return;
    }

  };

  onItemRemoved(a, p) {

    if (p == 'tag') {
      for (var i = this.tags.length - 1; i >= 0; i--) {
        if (this.tags[i] === a) {
          this.tags.splice(i, 1);
        }
      }
    } else if (p == 'variant1') {
      for (var i = this.variant1.length - 1; i >= 0; i--) {
        if (this.variant1[i] === a) {
          this.variant1.splice(i, 1);
        }
      }
    } else if (p == 'variant2') {
      for (var i = this.variant2.length - 1; i >= 0; i--) {
        if (this.variant2[i] === a) {
          this.variant2.splice(i, 1);
        }
      }
    } else {
      return;
    }

  };
  /***************************************TAGS************************************/

  onChangeReset() {
    //reset dropdown boxes when main category changes
    this.form.get("gender").setValue("");
    this.form.get("subcategory").setValue("");
  };


  onSubmitEditProduct() {

    if (this.quantity < 1) {
      this.toastr.error('You should have least 1 unit of the product', '', {
        timeOut: 3000
      });
      return;
    }

    if (this.listed_price <= 0) {
      this.toastr.error('List price must be be higher than zero', '', {
        timeOut: 3000
      });
      return;
    }

    if (this.reserve_price <= 0) {
      this.toastr.error('Reserve price must be be higher than zero', '', {
        timeOut: 3000
      });
      return;
    }

    //check reserve price strength
    if (this.validateService.priceDifference(this.reserve_price, this.listed_price) > 0) {
      this.toastr.warning('Please enter a reserve price that is lower than the list price', '', {
        timeOut: 3000
      });
      return false;
    };

    const product = {
      _id: this._id,
      name: this.name,
      type: this.type,
      condition: this.condition,
      brand: this.brand,
      category: this.category,
      subcategory: this.subcategory,
      gender: this.gender,
      isVariant: this.isVariant,
      variant1: this.variant1,
      variant2: this.variant2,
      description: this.description,
      listed_price: this.listed_price,
      reserve_price: this.reserve_price,
      quantity: this.quantity,
      tags: this.tags,
      locked_period: this.locked_period,
      currency: this.currency.toLowerCase(),
      location: this.location,
      deliveryMethod: this.deliveryMethod,
      deliveryCost: this.deliveryCost,
      isFreeDelivery: this.isFreeDelivery,
      return_policy: this.return_policy,
      image_Main: this.fileSources[0],
      image_1: this.fileSources[1],
      image_2: this.fileSources[2],
      image_3: this.fileSources[3],
      isInternational: this.isInternational,
      isReferenced: this.isReferenced,
      referenceURL: this.referenceURL,
      referenceID: this.referenceID,
    };

    console.log(product);

    //upload product information to db
    this.productsService.editProduct(product).subscribe(data => {
      if (data["success"]) {
        this.toastr.success('Product Edited', '', {
          timeOut: 3000
        });
        this.router.navigate(['/business/viewproduct']);

      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      }
    });

  };


  onClickMakeMain(image) {
    //return main item index
    var a = this.fileSources.indexOf(image);
    //insert main item at 0 index position from fileSources
    this.fileSources.splice(0, 0, this.fileSources[a]);
    //remove old item index position from fileSources
    this.fileSources.splice(a + 1, 1);
  };


  onClickDeleteImage(image) {
    //return main item index
    var a = this.fileSources.indexOf(image);
    //remove item index position from fileSources
    this.fileSources.splice(a, 1);
    //remove imagePath before passing to S3
    image = image.replace(this.imagePath, "")
  };

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  toUpperCase(str) {
    return str.toUpperCase();
  }

  selectDomestic() {
    this.isInternational = false;
  }

  selectInternational() {
    this.isInternational = true;
  }

  selectReferenced() {
    this.isReferenced = true;
  }

  selectUnreferenced() {
    this.isReferenced = false;
    this.referenceURL = null;
    this.referenceID = null;
  }

  selectIsVariant() {
    this.isVariant = true;
  }

  selectNoVariant() {
    this.isVariant = false;
    this.variant1 = [];
    this.variant2 = [];
  }

  selectFreeDelviery() {
    this.isFreeDelivery = true;
  }

  selectNoFreeDelviery() {
    this.isFreeDelivery = false;
  }

}