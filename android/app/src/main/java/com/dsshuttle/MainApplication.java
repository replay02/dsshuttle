package com.dsshuttle;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.art.ARTPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.horcrux.svg.SvgPackage;
import com.calendarevents.CalendarEventsPackage;
import com.kevinresol.react_native_default_preference.RNDefaultPreferencePackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ARTPackage(),
            new RNFirebasePackage(),
            new RNFirebaseMessagingPackage(),
            new SvgPackage(),
            new CalendarEventsPackage(),
            new RNDefaultPreferencePackage(),
            new AndroidOpenSettingsPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new MapsPackage(),
            new RNCardViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
