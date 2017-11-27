import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { SocialSharing } from '@ionic-native/social-sharing';

import { MyApp } from './app.component';
import { SelectColorPage } from '../pages/select-color/select-color';
import { SelectTexturePage } from '../pages/select-texture/select-texture';
import { DiagnosisPage } from '../pages/diagnosis/diagnosis';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { textureService } from './services/texture-service';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    MyApp,
    SelectColorPage,
    SelectTexturePage,
    DiagnosisPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText:'Back',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
    },
  ),
    AngularFireModule.initializeApp(environment.firebase, 'boop'),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SelectColorPage,
    SelectTexturePage,
    DiagnosisPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    textureService,
    Camera,
    Crop,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
