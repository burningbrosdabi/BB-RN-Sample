import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';
import { Platform } from 'react-native';
import { RoutePath } from 'routes';
import { BlockScreen } from 'scenes/auth/phone/BlockScreen';
import { OTPVerifyScreen } from 'scenes/auth/phone/OTPVerifyScreen';
import { PhoneVerifyScreen } from 'scenes/auth/phone/PhoneVerifyScreen';
import { ArchiveScreen } from 'scenes/checkout/archive.screen';
import { CheckoutNavigation } from 'scenes/checkout/checkout.navigation';
// Feed
import FeedbackTab from 'scenes/feed/FeedbackTab';
import { FeedCreating } from 'scenes/feed/FeedCreating';
import { FeedDetail } from 'scenes/feed/FeedDetail';
import { FeedListScreen } from 'scenes/feed/FeedListScreen';
import { FeedWriting } from 'scenes/feed/FeedWriting';
import { KolFeedbackScreen } from 'scenes/feed/KolFeedbackScreen';
import { CollectionsScreen } from 'scenes/home/collection/CollectionsScreen';
import { LandingScreen } from 'scenes/home/landing/LandingScreen';
// Magazine
import CommentListScreen from 'scenes/home/magazine/CommentListScreen';
import { MagazineScreen } from 'scenes/home/magazine/MagazineDetailScreen';
import { MagazinesScreen } from 'scenes/home/magazine/MagazineScreen';
import { PromotionScreen } from 'scenes/home/promotion/PromotionScreen';
import { SaleDetailScreen } from 'scenes/home/sale/SaleDetailScreen';
import { SaleProductListScreen } from 'scenes/home/sale/SaleProductLiscScreen';
import { SaleScreen } from 'scenes/home/sale/SaleScreen';
import { NotificationScreen } from 'scenes/notification/NotificationScreen';
import AppTrackingScreen from 'scenes/onboarding/AppTrackingScreen';
import StyleSelectionScreen from 'scenes/onboarding/StyleSelectionScreen';
import { CartScreen } from 'scenes/order/cart/CartScreen';
import VoucherScreen from 'scenes/order/checkout/VoucherScreen';
import OrderDeliveryStatusScreen from 'scenes/order/orderHistory/OrderDeliveryStatusScreen';
import OrderFeedbackScreen from 'scenes/order/orderHistory/OrderFeedbackScreen';
import OrderHistoryScreen from 'scenes/order/orderHistory/OrderHistoryScreen';
import OrderListScreen from 'scenes/order/orderHistory/OrderListScreen';
import OrdersDetailScreen from 'scenes/order/orderHistory/OrdersDetailScreen';
import OrdersRefundExchangeScreen from 'scenes/order/orderHistory/OrdersRefundExchangeScreen';
import PickABScreen from 'scenes/pick/PickAB/PickABScreen';
import { PickHistory } from 'scenes/pick/PickHistory';
import PickIn6ExplanationScreen from 'scenes/pick/PickIn6/PickIn6Explanation';
import PickIn6Screen from 'scenes/pick/PickIn6/PinkIn6Screen';
import { PickRecommendationScreen } from 'scenes/pick/PickRecomendation';
import PickAnalysisScreen from 'scenes/pick/PickResultScreen.v2';
import { ProducCategoryFilterScreen } from 'scenes/product/ProducCategoryFilterScreen';
import ProductDetailScreen from 'scenes/product/ProductDetailScreen';
import ProductWebViewScreen from 'scenes/product/ProductWebViewScreen';
import { RelatedProductScreen } from 'scenes/product/RelatedProductScreen';
import ProductFeedbackImageScreen from 'scenes/product/review/ProductFeedbackImageScreen';
import ProductFeedbackDetailScreen from 'scenes/product/review/ProductReviewDetailScreen';
import ProductFeedbackListScreen from 'scenes/product/review/ProductReviewListScreen';
import FavoriteScreen from 'scenes/profile/favorite/FavoriteScreen';
import { FavoriteWatchedProduct } from 'scenes/profile/favorite/FavoriteWatchedProduct';
import { FeedCollectionTab } from 'scenes/profile/favorite/FeedCollectionTab';
import UserFeedbackListScreen from 'scenes/profile/feedbacks/UserFeedbackListScreen';
import CreateEditRecipientScreen from 'scenes/profile/recipients/CreateEditRecipientScreen';
import RecipientListScreen from 'scenes/profile/recipients/RecipientListScreen';
import NotificationSettingScreen from 'scenes/profile/setting/NotificationSettingScreen';
import ProfileSettingScreen from 'scenes/profile/setting/ProfileSettingScreen';
import SettingScreen from 'scenes/profile/setting/SettingScreen';
import SocialAccountSettingScreen from 'scenes/profile/setting/SocialAccountSettingScreen';
import SupporterSettingScreen from 'scenes/profile/setting/SupporterSettingScreen';
import TermsAndConditionsScreen from 'scenes/profile/setting/TermsAndConditionsScreen';
import AgeSelectionScreen from 'scenes/profile/UserData/AgeSelectionScreen';
import CitySelectionScreen from 'scenes/profile/UserData/CitySelectionScreen';
import { SearchAdsScreen } from 'scenes/search/SearchAds';
import { SearchRecommendScreen } from 'scenes/search/SearchRecommendScreen';
import { SearchResultScreen } from 'scenes/search/SearchResultScreen';
import StoreDetailScreen from 'scenes/store/StoreDetailScreen';
import StoreUpdateScreen from 'scenes/store/StoreUpdateScreen';
import { FollowScreen } from 'scenes/user/FollowScreen';
import { ReportInputScreen } from 'scenes/user/ReportScreen';
import UserProfileScreen from 'scenes/user/UserProfileScreen';
import AuthNavigation from './AuthNavigation';
import TabNavigation from './TabNavigation';
import { FollowingFeedScreen } from 'scenes/home/FollowingFeed/FollowingFeed';
import { PlaceDetailScreen } from 'scenes/place/PlaceDetailScreen';

function transparentHeaderOptions(): NativeStackNavigationOptions {
  return {
    headerShown: false,
    orientation: 'portrait_up',
    animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
    ...TransitionPresets.SlideFromRightIOS,
  };
}

function modalTransitionOption(): NativeStackNavigationOptions {
  return {
    headerShown: false,
    orientation: 'portrait_up',
    presentation: 'modal',
  };
}

const Stack = createNativeStackNavigator();

function MainNavigation() {
  return (
    <Stack.Navigator screenOptions={transparentHeaderOptions}>
      {/* Main Tab navigator Screens */}
      <Stack.Screen name="Tab" component={TabNavigation} options={transparentHeaderOptions} />
      <Stack.Screen
        name={RoutePath.auth}
        component={AuthNavigation}
      // options={modalTransitionOption}
      />
      {Platform.OS === 'ios' && (
        <Stack.Screen
          name="AppTracking"
          component={AppTrackingScreen}
          options={{ headerShown: false }}
        />
      )}
      {/* Pick Related Screens */}
      <Stack.Group screenOptions={{ ...transparentHeaderOptions, animation: 'slide_from_bottom' }}>
        <Stack.Screen name={RoutePath.pickExplanation} component={PickIn6ExplanationScreen} />
        {/* <Stack.Screen name="PickResult" component={PickResultScreen} /> */}
        <Stack.Screen name="PickAB" component={PickABScreen} />
        <Stack.Screen name="PickIn6" component={PickIn6Screen} />
        <Stack.Screen
          name={RoutePath.pickAnalysis}
          component={PickAnalysisScreen}
          options={{ animation: Platform.OS === 'android' ? 'none' : 'default' }}
        />
      </Stack.Group>
      <Stack.Screen
        name={RoutePath.report}
        component={ReportInputScreen}
        options={modalTransitionOption}
      />

      <Stack.Screen name={RoutePath.magazine} component={MagazineScreen} />
      <Stack.Screen
        name={RoutePath.notifications}
        component={NotificationScreen}
      // options={modalTransitionOption}
      />
      {/* Product Related Screens */}
      <Stack.Screen name={RoutePath.productDetail} component={ProductDetailScreen} />
      <Stack.Screen
        name={RoutePath.productWebView}
        component={ProductWebViewScreen}
        options={modalTransitionOption}
      />

      <Stack.Screen name="ProductFeedbackDetail" component={ProductFeedbackDetailScreen} />

      <Stack.Screen name="Favorite" component={FavoriteScreen} />
      <Stack.Screen
        name={RoutePath.UserProfile}
        component={UserProfileScreen}
        options={transparentHeaderOptions()}
      />

      <Stack.Screen
        name="StoreUpdateScreen"
        component={StoreUpdateScreen}
        options={transparentHeaderOptions()}
      />
      <Stack.Screen name="category/filter" component={ProducCategoryFilterScreen} />
      {/* Store Related Screens */}
      <Stack.Screen name={RoutePath.storeDetail} component={StoreDetailScreen} />
      {/* Profile Related Screens */}
      <Stack.Screen name="setting" component={SettingScreen} />
      <Stack.Screen name="ProfileUpdate" component={ProfileSettingScreen} />
      <Stack.Screen name={RoutePath.socialSetting} component={SocialAccountSettingScreen} />
      <Stack.Screen name={RoutePath.notificationSetting} component={NotificationSettingScreen} />
      <Stack.Screen name={RoutePath.termsAndConditions} component={TermsAndConditionsScreen} />
      <Stack.Screen name={RoutePath.supporterSetting} component={SupporterSettingScreen} />
      <Stack.Screen name={RoutePath.styleSetting} component={StyleSelectionScreen} />

      {/* Common Header Screens */}
      <Stack.Screen name="Search" component={SearchAdsScreen} options={transparentHeaderOptions} />

      <Stack.Screen name={RoutePath.promotion} component={PromotionScreen} />
      <Stack.Screen name={RoutePath.favoriteWatchedProduct} component={FavoriteWatchedProduct} />
      <Stack.Screen name={RoutePath.ageSelectionScreen} component={AgeSelectionScreen} />
      <Stack.Screen name={RoutePath.citySelectionScreen} component={CitySelectionScreen} />
      <Stack.Screen
        name={RoutePath.createEditRecipientScreen}
        component={CreateEditRecipientScreen}
      />
      <Stack.Screen
        name={RoutePath.recipientListScreen}
        component={RecipientListScreen}
      // options={modalTransitionOption}
      />
      <Stack.Screen
        name={RoutePath.voucherScreen}
        component={VoucherScreen}
      // options={modalTransitionOption}
      />
      <Stack.Screen
        name={RoutePath.orderFeedbackScreen}
        component={OrderFeedbackScreen}
      // options={modalTransitionOption}
      />
      <Stack.Screen
        name={RoutePath.ordersRefundExchangScreen}
        component={OrdersRefundExchangeScreen}
      // options={modalTransitionOption}
      />
      <Stack.Screen
        name={RoutePath.cart}
        component={CartScreen}
      // options={modalTransitionOption}
      />
      <Stack.Screen
        name={RoutePath.orderHistoryScreen}
        component={OrderHistoryScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen name={RoutePath.orderDetailScreen} component={OrdersDetailScreen} />
      <Stack.Screen
        name={RoutePath.orderDeliveryStatusScreen}
        component={OrderDeliveryStatusScreen}
      />
      <Stack.Screen name={RoutePath.verifyPhone} component={PhoneVerifyScreen} />
      <Stack.Screen name={RoutePath.verifyOTP} component={OTPVerifyScreen} />
      <Stack.Screen name={RoutePath.verifyBlocked} component={BlockScreen} />
      <Stack.Screen
        name={RoutePath.checkout}
        // options={modalTransitionOption}
        component={CheckoutNavigation}
      />
      <Stack.Screen
        name={RoutePath.checkoutArchive}
        component={ArchiveScreen}
      //  options={modalTransitionOption}
      />
      <Stack.Screen
        name={RoutePath.productFeedbackListScreen}
        component={ProductFeedbackListScreen}
      />
      <Stack.Screen
        name={RoutePath.userFeedbackImageScreen}
        component={ProductFeedbackImageScreen}
      />
      <Stack.Screen name={RoutePath.userFeedbackListScreen} component={UserFeedbackListScreen} />
      <Stack.Screen name={RoutePath.relatedProductScreen} component={RelatedProductScreen} />
      <Stack.Screen name={RoutePath.commentListScreen} component={CommentListScreen} />
      <Stack.Screen name={RoutePath.follow} component={FollowScreen} />

      <Stack.Screen name={RoutePath.feedbacks} component={FeedbackTab} />

      <Stack.Screen name={RoutePath.collection} component={LandingScreen} />
      <Stack.Screen name={RoutePath.feed} component={FeedDetail} />
      <Stack.Screen name={RoutePath.feedCreate} component={FeedCreating} />
      <Stack.Screen name={RoutePath.feedWriting} component={FeedWriting} />
      <Stack.Screen name={RoutePath.feedFollows} component={FeedCollectionTab} />
      <Stack.Screen name={RoutePath.pickRecommend} component={PickRecommendationScreen} />
      <Stack.Screen name={RoutePath.pickHistory} component={PickHistory} />
      <Stack.Screen name={RoutePath.collections} component={CollectionsScreen} />
      <Stack.Screen name={RoutePath.magazines} component={MagazinesScreen} />
      <Stack.Screen name={RoutePath.feeds} component={FeedListScreen} />
      <Stack.Screen name={RoutePath.kolFeedback} component={KolFeedbackScreen} />
      <Stack.Screen name={RoutePath.saleDetail} component={SaleDetailScreen} />
      <Stack.Screen name={RoutePath.saleProductList} component={SaleProductListScreen} />

      <Stack.Screen name={RoutePath.searchRecommend} component={SearchRecommendScreen} />
      <Stack.Screen name={RoutePath.searchResult} component={SearchResultScreen} />
      <Stack.Screen name={RoutePath.orders} component={OrderListScreen} />
      <Stack.Screen name={RoutePath.sales} component={SaleScreen} />
      <Stack.Screen name={RoutePath.followingFeeds} component={FollowingFeedScreen} />
      <Stack.Screen name={RoutePath.placeDetail} component={PlaceDetailScreen} />
    </Stack.Navigator>
  );
}

export default MainNavigation;
