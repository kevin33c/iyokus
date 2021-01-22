import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

//import services
import { ProductsService } from '../../../services/products.service';
import { ValidateService } from '../../../services/validate.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';
import { ScriptService } from '../../../services/script.service';
import { DataService } from '../../../services/data.service';

import { Category } from '../../../models/category';
import { Subcategory } from '../../../models/subcategory';


@Component({
    selector: 'app-upload-product',
    templateUrl: './upload-product.component.html',
    styleUrls: ['./upload-product.component.css'],
})
export class UploadProductComponent implements OnInit {

    selectedFile: File;
    selectedFileName: String = 'Select file';
    //ckeditor
    ckeConfig: any;

    //product interface
    sellerID: String;
    name: String;
    type: number;
    brand: String;
    category: string;
    subcategory: string;
    gender: number;
    description: String;
    price: Number;
    reserve: Number;
    quantity: Number;
    productID: String = uuid();
    image_Main: String;
    image_1: String;
    image_2: String;
    image_3: String;
    return_policy: Number;
    locked_period: Number;
    tags: String[] = [];
    variant1: String[] = [];
    variant2: String[] = [];
    condition: Number;
    currency: String = 'GBP';
    location: String[];
    deliveryMethod: string;
    deliveryCost: Number;
    isReferenced: boolean = false;
    isInternational: boolean = false;
    isVariant: boolean = false;
    referenceURL: string;
    referenceID: string;
    isFreeDelivery: boolean = false;

    //set image upload path
    imagePath: String = 'https://woolime.s3.eu-west-3.amazonaws.com/';

    selectedFiles: [FileList];
    user: any;

    //to load images to S3
    public fileSources: string[] = [];

    categories: Category[];
    subcategories: Subcategory[];

    constructor(
        private authService: AuthService,
        private productsService: ProductsService,
        private validateService: ValidateService,
        private toastr: ToastrService,
        private router: Router,
        private spinnerService: Ng4LoadingSpinnerService,
        private seoService: SeoService,
        private scriptService: ScriptService,
        private dataService: DataService,
    ) { }


    ngOnInit() {

        //load CKeditor script
        this.scriptService.loadScript('https://cdn.ckeditor.com/4.7.0/full-all/ckeditor.js');

        this.seoService.setSectionMetadata('Upload Product');

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


        this.authService.getProfile().subscribe(profile => {
            this.user = profile["user"];
            this.location = this.user.location;

            if (this.user.type == 'seller') {
                this.deliveryMethod = '0';
                //this.return_policy = 0;
            };


        });
        //load product categories
        this.categories = this.dataService.getCategory();

    };



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

    onSelectCategory(categoryID) {
        //if category change then reset gender and subcategory selection
        this.gender = undefined
        this.subcategory = undefined
        //display the subcategory for the category selected
        this.subcategories = this.dataService.getSubcategory().filter((item) => item.categoryID == categoryID);
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

    onSubmitProduct() {

        if (this.quantity < 1) {
            this.toastr.error('You should have least 1 unit of the product', '', {
                timeOut: 3000
            });
            return;
        }

        if (this.price <= 0) {
            this.toastr.error('List price must be be higher than zero', '', {
                timeOut: 3000
            });
            return;
        }

        if (this.reserve <= 0) {
            this.toastr.error('Reserve price must be be higher than zero', '', {
                timeOut: 3000
            });
            return;
        }

        //check reserve price strength
        if (this.validateService.priceDifference(this.reserve, this.price) > 0) {
            this.toastr.warning('Please enter a reserve price that is lower than the list price', '', {
                timeOut: 3000
            });
            return false;
        };


        //define product to be uploaded
        const product = {
            productID: this.productID,
            sellerID: this.user._id,
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
            listed_price: this.price,
            reserve_price: this.reserve,
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


        //upload product information to db
        this.productsService.uploadProduct(product).subscribe(data => {
            if (data["success"]) {
                this.toastr.success('Product Uploaded', '', {
                    timeOut: 3000
                });
                this.router.navigate(['/business/viewproduct']);
                window.scrollTo(0, 0);
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

    toUpperCase(str){
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
