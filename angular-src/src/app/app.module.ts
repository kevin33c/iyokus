//import modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


//import services
import { AuthService } from './services/auth.service';
import { ProductsService } from './services/products.service';
import { DataService } from './services/data.service';
import { RecommendationService } from './services/recommendation.service';
import { SeoService } from './services/seo.service';
import { ScriptService } from './services/script.service';
import { ValidateService } from './services/validate.service';
import { WebsocketService } from './services/websocket.service';

//import components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/misc/not-found/not-found.component';

//import shared components module
import { SharedModule } from './components/shared.module'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng4LoadingSpinnerModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SharedModule,
    NgbModule.forRoot(),
  ],
  providers: [
    AuthService,
    ProductsService,
    AuthGuard,
    DataService,
    RecommendationService,
    SeoService,
    ScriptService,
    ValidateService,
    WebsocketService,
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

