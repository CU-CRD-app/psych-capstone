import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSettingsPageRoutingModule } from './user-settings-routing.module';

import { UserSettingsPage } from './user-settings.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSettingsPageRoutingModule
  ],
  declarations: [UserSettingsPage],
  providers: [LocalNotifications, OpenNativeSettings]
})
export class UserSettingsPageModule {}
