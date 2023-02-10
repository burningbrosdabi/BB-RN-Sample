import { DabiFont } from 'assets/icons';
import LoadingIndicator from 'components/loading/LoadingIndicator';
import React, { PureComponent } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { WebView } from 'react-native-webview';
import { RoutePath } from 'routes';
import { Logger } from 'services/log';
import { NavigationService } from 'services/navigation';
import { Colors, Spacing, Typography } from 'styles';
import * as cs from '_styles/legacy/common.style';
import theme from '_styles/legacy/theme.style';


// https://github.com/react-native-webview/react-native-webview/issues/341
class ProductWebViewScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      previousUrl: '',
    };
  }

  componentDidMount() {
    const { productLink, fastLoading, productSource, productName } = this.props.route.params;
    this.setState({ productLink, fastLoading, productSource, productName });
  }

  _renderLoading() {
    return (
      <LoadingIndicator isLoading={this.state.isLoading}>
        <View
          style={{
            width: Spacing.screen.width,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: theme.PADDING_16 * 3,
          }}>
          <Text style={[Typography.boxTitle, cs.c_pc, cs.mt_20, cs.ta_c]}>
            Đang tải sản phẩm{'\n'}Vui lòng đợi một lát nhé
          </Text>
          <Text style={[Typography.smallCaption, cs.c_pg, cs.mt_20, cs.ta_c]}>
            DABI (BURNING BROS INC.) không phải là đương sự giao dịch. DABI chỉ đưa các sản phẩm của
            các cửa hàng vào app, đóng vai trò trung gian cho các giao dịch. Đối với sản phẩm thực
            tế, thông tin giao dịch, các về cần giao dịch, trách nhiệm sẽ thuộc về chính cửa hàng
            đó.
          </Text>
        </View>
      </LoadingIndicator>
    );
  }

  handleWebViewNavigationStateChange = (newNavState) => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    const { url } = newNavState;

    if (!url) return;
    // Check shopee product in DB
    if (this.state.productSource == 'SHOPEE') {
      this.setState({ previousUrl: url });

      const stringList = url.split('.');
      const stringComponent = stringList.length;
      // https://shopee.vn/mintofficial.vn/3957127381
      if (stringComponent > 2) {
        const shopee_item_id = stringList[stringComponent - 1];
      }

      console.log("LOG_EVENT:  " + url);
      try {
        const product = this.props.route.params || {}
        const logParams = {
          value: product?.original_price,
          items: [{
            item_category: "Shopee",
            item_brand: product?.storeName || '',
            item_id: product?.pk + '',
            item_name: product?.name || '',
            item_variant: '', // product option
            quantity: 1, // quantity
            item_location_id: product?.product_link || '',
          }],
          coupon: '',
          affiliation: "Shopee",
          transaction_id: '',
          shipping: 0,
        }
        if (this.state.previousUrl !== url && !this.state.previousUrl.includes("shopee.vn/cart") && url.includes("shopee.vn/cart")) {
          Logger.instance.logAddToCart(logParams);
        } else if (this.state.previousUrl !== url && !this.state.previousUrl.includes("shopee.vn/checkout") && url.includes("shopee.vn/checkout")) {
          Logger.instance.logBeginCheckout(logParams);
        } else if (this.state.previousUrl !== url && !this.state.previousUrl.includes("shopee.vn/buyer/payment") && url.includes("shopee.vn/buyer/payment")) {
          Logger.instance.logPurchase(logParams);
        }
      } catch (error) {
        console.log("LOG_EVENT ERROR", error);
      }
    }
    // handle certain doctypes
    if (url.includes('.pdf')) {
      this.webview.stopLoading();
      // open a modal with the PDF viewer
    }

    // one way to handle a successful form submit is via query strings
    if (url.includes('?message=success')) {
      this.webview.stopLoading();
      // maybe close this view?
    }

    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
    }

    // redirect somewhere else
    if (url.includes('google.com')) {
      const newURL = 'https://logrocket.com/';
      // const redirectTo = 'window.location = "' + newURL + '"';
      // this.webview.injectJavaScript(redirectTo);
    }
  };

  _onBack = () => {
    const { previousUrl } = this.state
    const isPurchased = (previousUrl.includes("shopee.vn/me") || previousUrl.includes("shopee.vn/buyer/payment"))
    Logger.instance.logBackFromShopee({
      from: RoutePath.productWebView,
      to: RoutePath.productDetail,
      params: {
        purchased: isPurchased
      }
    });
    NavigationService.instance.goBack();
  }

  _renderHeader = () => {
    return <View style={{
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 16,
      height: 48,
    }}>
      <Ripple
        onPress={this._onBack}
        rippleContainerBorderRadius={25}
        style={{
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <DabiFont name="small_delete" size={18} color={Colors.surface.midGray} />
      </Ripple>
      <View style={{ flex: 1 }}>
        <Text style={{ ...Typography.title }} numberOfLines={1}>{this.state.productName}</Text>
      </View>
    </View>
  }
  render() {
    const { fastLoading, productLink } = this.state;
    // onBack={this._onBack}
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1
          }}>
          {this._renderHeader()}
          <WebView
            onLoadStart={() => {
              fastLoading && this.setState({ isLoading: false });
            }}
            onLoadEnd={() => {
              this.setState({ isLoading: false });
            }}
            onHttpError={() => {
              alert('error');
            }}
            onError={() => {
              alert('error');
            }}
            source={{ uri: productLink }}
            renderLoading={this._renderLoading}
            onNavigationStateChange={this.handleWebViewNavigationStateChange}
          />
          {this.state.isLoading && this._renderLoading()}
        </View>
      </SafeAreaView>
    );
  }
}

export default ProductWebViewScreen;
