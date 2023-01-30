import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    loadChildren: () => import('./language/language.module').then(m => m.LanguagePageModule)
    // loadChildren: () => import('./slider/slider.module').then(m => m.SliderPageModule)
    // redirectTo: 'home',
    // pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'productlist',
    loadChildren: () => import('./productlist/productlist.module').then(m => m.ProductlistPageModule)
  },
  {
    path: 'productview/:product_id',
    loadChildren: () => import('./productview/productview.module').then(m => m.ProductviewPageModule)
  },
  {
    path: 'revieworder',
    loadChildren: () => import('./revieworder/revieworder.module').then(m => m.RevieworderPageModule)
  },
  {
    path: 'deliveryaddress',
    loadChildren: () => import('./deliveryaddress/deliveryaddress.module').then(m => m.DeliveryaddressPageModule)
  },
  {
    path: 'addaddress',
    loadChildren: () => import('./addaddress/addaddress.module').then(m => m.AddaddressPageModule)
  },
  {
    path: 'addressbook',
    loadChildren: () => import('./addressbook/addressbook.module').then(m => m.AddressbookPageModule)
  },
  {
    path: 'paymentoption',
    loadChildren: () => import('./paymentoption/paymentoption.module').then(m => m.PaymentoptionPageModule)
  },
  {
    path: 'paymentsuccess',
    loadChildren: () => import('./paymentsuccess/paymentsuccess.module').then(m => m.PaymentsuccessPageModule)
  },
  {
    path: 'myorders',
    loadChildren: () => import('./myorders/myorders.module').then(m => m.MyordersPageModule)
  },
  {
    path: 'orderdetail/:order_id',
    loadChildren: () => import('./orderdetail/orderdetail.module').then(m => m.OrderdetailPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'editaddress',
    loadChildren: () => import('./editaddress/editaddress.module').then(m => m.EditaddressPageModule)
  },
  {
    path: 'contactus',
    loadChildren: () => import('./contactus/contactus.module').then(m => m.ContactusPageModule)
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./wishlist/wishlist.module').then(m => m.WishlistPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then(m => m.LocationPageModule)
  },
  {
    path: 'changepassword',
    loadChildren: () => import('./changepassword/changepassword.module').then(m => m.ChangepasswordPageModule)
  },
  {
    path: 'deliveryslots',
    loadChildren: () => import('./deliveryslots/deliveryslots.module').then(m => m.DeliveryslotsPageModule)
  },
  {
    path: 'profileaddaddress',
    loadChildren: () => import('./profileaddaddress/profileaddaddress.module').then(m => m.ProfileaddaddressPageModule)
  },
  {
    path: 'searchlist',
    loadChildren: () => import('./searchlist/searchlist.module').then( m => m.SearchlistPageModule)
  },
  {
    path: 'privacypolicy',
    loadChildren: () => import('./privacypolicy/privacypolicy.module').then( m => m.PrivacypolicyPageModule)
  },
  {
    path: 'aboutus',
    loadChildren: () => import('./aboutus/aboutus.module').then( m => m.AboutusPageModule)
  },
  {
    path: 'updateversion',
    loadChildren: () => import('./updateversion/updateversion.module').then( m => m.UpdateversionPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'subcategory',
    loadChildren: () => import('./subcategory/subcategory.module').then( m => m.SubcategoryPageModule)
  },
  {
    path: 'slider',
    loadChildren: () => import('./slider/slider.module').then( m => m.SliderPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'maplocation',
    loadChildren: () => import('./maplocation/maplocation.module').then( m => m.MaplocationPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'refundpolicy',
    loadChildren: () => import('./refundpolicy/refundpolicy.module').then( m => m.RefundpolicyPageModule)
  },
  {
    path: 'cancelpolicy',
    loadChildren: () => import('./cancelpolicy/cancelpolicy.module').then( m => m.CancelpolicyPageModule)
  },
  {
    path: 'addreview',
    loadChildren: () => import('./addreview/addreview.module').then( m => m.AddreviewPageModule)
  },
  {
    path: 'refer',
    loadChildren: () => import('./refer/refer.module').then( m => m.ReferPageModule)
  },
  {
    path: 'mywallet',
    loadChildren: () => import('./mywallet/mywallet.module').then( m => m.MywalletPageModule)
  },
  {
    path: 'addcash',
    loadChildren: () => import('./addcash/addcash.module').then( m => m.AddcashPageModule)
  },
  {
    path: 'mysubscription',
    loadChildren: () => import('./mysubscription/mysubscription.module').then( m => m.MysubscriptionPageModule)
  },
  {
    path: 'cmcontact',
    loadChildren: () => import('./cmcontact/cmcontact.module').then( m => m.CmcontactPageModule)
  },
  {
    path: 'subscriptionsuccess',
    loadChildren: () => import('./subscriptionsuccess/subscriptionsuccess.module').then( m => m.SubscriptionsuccessPageModule)
  },
  {
    path: 'specialtag',
    loadChildren: () => import('./specialtag/specialtag.module').then( m => m.SpecialtagPageModule)
  },
  {
    path: 'paymentfailure',
    loadChildren: () => import('./paymentfailure/paymentfailure.module').then( m => m.PaymentfailurePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'bestseller',
    loadChildren: () => import('./bestseller/bestseller.module').then( m => m.BestsellerPageModule)
  },
  {
    path: 'trackorder',
    loadChildren: () => import('./trackorder/trackorder.module').then( m => m.TrackorderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
