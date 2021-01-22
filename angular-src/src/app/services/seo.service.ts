import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
@Injectable()
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta
  ) { }


  //set metadata
  setMetadata(title?, imageURL?, tags?, description?) {

    //description parse from html to text
    var html = description;
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = div.textContent || div.innerText || "";
    //remove line breaks
    text = text.replace(/(\r\n|\n|\r)/gm, "").replace(/&nbsp;/g, '').replace(/  /g, '');
    //keywords
    var keywords = title.split(' ');

    //main
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: text });
    this.meta.updateTag({ name: 'keywords', content: keywords + tags });
    //twitter
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: text });
    this.meta.updateTag({ name: 'twitter:image', content: imageURL });
    //facebook
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:image', content: imageURL });
    this.meta.updateTag({ property: 'og:description', content: text });


    //start at top of the page
    window.scrollTo(0, 0);

  };

  setSectionMetadata(title?) {

    var defaultDescription = "Experience a new way of online shopping with Iyokus and pay only what you are willing to pay in electronics, games, books, furnitures, fashion, sport and much more."

    var defaultKeyword = "lowest prices, bid shopping"

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: defaultDescription });
    this.meta.updateTag({ name: 'keywords', content: defaultKeyword });
    //twitter
    this.meta.updateTag({ name: 'twitter:title', content: title});
    this.meta.updateTag({ name: 'twitter:description', content: defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: "https://s3.eu-west-3.amazonaws.com/woolime/assets/Logo_Iyokus_Color.png" });
    //facebook
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ property: 'og:title', content: title});
    this.meta.updateTag({ property: 'og:image', content: "https://s3.eu-west-3.amazonaws.com/woolime/assets/Logo_Iyokus_Color.png" });
    this.meta.updateTag({ property: 'og:description', content: defaultDescription });

    //start at top of the page
    window.scrollTo(0, 0);
  };


  setProductCategoryMetadata(title?) {

    var defaultDescription = title;

    var defaultKeyword = title;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: defaultDescription });
    this.meta.updateTag({ name: 'keywords', content: defaultKeyword });
    //twitter
    this.meta.updateTag({ name: 'twitter:title', content: title + " @iyokus.com" });
    this.meta.updateTag({ name: 'twitter:description', content: defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: "https://s3.eu-west-3.amazonaws.com/woolime/assets/Logo_Iyokus_Color.png" });
    //facebook
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ property: 'og:title', content: title + " @iyokus.com" });
    this.meta.updateTag({ property: 'og:image', content: "https://s3.eu-west-3.amazonaws.com/woolime/assets/Logo_Iyokus_Color.png" });
    this.meta.updateTag({ property: 'og:description', content: defaultDescription });

    //start at top of the page
    window.scrollTo(0, 0);
  };

}
