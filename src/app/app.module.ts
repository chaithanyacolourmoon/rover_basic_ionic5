import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpComponent } from './modals/otp/otp.component';
import { ForgotpasswordComponent } from './modals/forgotpassword/forgotpassword.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { SidepopoverComponent } from './modals/sidepopover/sidepopover.component';
import { SortComponent } from './modals/sort/sort.component';
import { DatePipe } from '@angular/common';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';
import { OtpverifyComponent } from './modals/otpverify/otpverify.component';
import { SelectlocationComponent } from './modals/selectlocation/selectlocation.component';
import { SelectquantityComponent } from './modals/selectquantity/selectquantity.component';
import { NointernetpageComponent } from './modals/nointernetpage/nointernetpage.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { FilterComponent } from './modals/filter/filter.component';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SubscriptionmodalComponent } from './modals/subscriptionmodal/subscriptionmodal.component';
import { CouponlistComponent } from './modals/couponlist/couponlist.component';
import { NotificationdataComponent } from './notificationdata/notificationdata.component';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { PaymentoptionmodalComponent } from './modals/paymentoptionmodal/paymentoptionmodal.component';

@NgModule({
  declarations: [AppComponent, OtpComponent, ForgotpasswordComponent, SidepopoverComponent, SubscriptionmodalComponent,
    SortComponent,OtpverifyComponent,SelectlocationComponent,SelectquantityComponent,
    NointernetpageComponent,FilterComponent,CouponlistComponent,NotificationdataComponent,PaymentoptionmodalComponent],
  entryComponents: [OtpComponent, ForgotpasswordComponent, SidepopoverComponent, SortComponent,
    OtpverifyComponent,SelectquantityComponent,NointernetpageComponent,SubscriptionmodalComponent,
  SelectlocationComponent,FilterComponent,CouponlistComponent,NotificationdataComponent,PaymentoptionmodalComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    HttpClientModule],
  providers: [StatusBar,
    Clipboard,
    SplashScreen,
    AppVersion,
    Network,
    Geolocation,
    NativeGeocoder,
    Diagnostic,
    AndroidPermissions,
    SocialSharing,
    InAppBrowser,
    Push,
    DatePipe, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
