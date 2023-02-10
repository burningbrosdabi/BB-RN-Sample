import React, { Component } from 'react';
import { Image, Platform, Text, View } from 'react-native';
import { Colors, Outlines, Typography } from 'styles';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import theme from 'styles/legacy/theme.style';
import { errorTranslation } from 'styles/legacy/translations';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';
import Ripple from 'react-native-material-ripple';
import { DabiFont } from 'assets/icons';



const defaultState = {
  validEmail: false,
  errorEmail: '',
  validPassword: false,
  errorPassword: '',
  email: '1111111',
  password: '111111',
  isLoading: false,
};

export default class EmailLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultState,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  resetState = () => {
    this.setState(defaultState)
    this.emailRef?.clear()
    this.passwordRef?.clear()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message && this.props.message) {
      if (this.props.message.email) {
        this.setState({
          errorEmail: "Email này chưa được đăng ký.",
        })
      } else if (this.props.message.non_field_errors?.length > 0) {
        this.setState({
          errorPassword: "Mật khẩu không đúng."
        })
      }
    }
  }

  onEndEditingPass = () => {
    const { validPassword, password } = this.state;
    if (!validPassword && password !== '') {
      this.setState({ errorPassword: "Mật khẩu phải dài hơn 7 kí tự" })
    } else {
      this.setState({ errorPassword: "" })
    }
  }
  onEndEditingEmail = () => {
    const { validEmail, email } = this.state;
    if (!validEmail && email !== '') {
      this.setState({ errorEmail: "Email không hợp lệ" })
    } else {
      this.setState({ errorEmail: "" })
    }
  }

  handleEmailChange(email) {
    const emailCheckRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    const { validEmail } = this.state;
    this.setState({ email: email });

    if (emailCheckRegex.test(email)) {
      this.setState({ validEmail: true, errorEmail: "" });
    } else if (email && !emailCheckRegex.test(email)) {
      this.setState({ validEmail: false, errorEmail: "Email không hợp lệ" });
    } else {
      this.setState({ errorEmail: "" });
    }
  }

  handlePasswordChange(password) {
    const passwordCheckRegex = /^.{8,}$/;
    const { validPassword } = this.state;
    this.setState({ password });

    if (passwordCheckRegex.test(password)) {
      this.setState({ validPassword: true, errorPassword: "" });
    } else if (password && !passwordCheckRegex.test(password)) {
      this.setState({ validPassword: false, errorPassword: "Mật khẩu phải dài hơn 7 kí tự" });
    } else {
      this.setState({ errorPassword: "" });
    }
  }

  toggleNextButtonState() {
    const { validEmail, validPassword } = this.state;
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }

  render() {
    const { isLoading, validEmail, validPassword, email, errorEmail, errorPassword, password } = this.state;
    return (
      <View>
        <DEPRECATED_InputField
          inputRef={ref => this.emailRef = ref}
          labelText="Email"
          labelTextSize={12}
          labelColor={Colors.black}
          textColor={Colors.text}
          borderBottomColor={Colors.primary}
          inputType="email"
          customStyle={{ marginBottom: 24 }}
          onChangeText={this.handleEmailChange}
          showCheckmark={validEmail}
          autoCapitalize={'none'}
          comment="Nhập email của bạn"
          editable={!this.state.isLoading}
          errorMsg={errorEmail}
          maxLength={40}
        />
        <DEPRECATED_InputField
          inputRef={ref => this.passwordRef = ref}
          labelText="Mật khẩu"
          labelTextSize={12}
          labelColor={Colors.black}
          textColor={Colors.text}
          borderBottomColor={Colors.primary}
          inputType="password"
          customStyle={{ marginBottom: 8 }}
          onChangeText={this.handlePasswordChange}
          showCheckmark={validPassword}
          autoCapitalize={'none'}
          comment="Mật khẩu phải dài hơn 7 kí tự"
          editable={!this.state.isLoading}
          errorMsg={errorPassword}
        />
        {this.props.login_error ? (
          <Text style={{
            color: theme.PRIMARY_COLOR,
            marginTop: theme.MARGIN_10,
            marginBottom: theme.MARGIN_5,
            fontSize: theme.FONT_SIZE_12,
            textAlign: 'center',
          }}>
            {errorTranslation[this.props.login_error.pop()]}</Text>
        ) : null}
        <View style={{ height: 16 }} />
        <Ripple onPress={() => this.props.navigation?.navigate('ResetPassword')}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
        >
          <Text style={Typography.name_button}>Đặt lại mật khẩu</Text>
          <View style={{ width: 8 }} />
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' }}>
            <DabiFont size={12} color={Colors.white} name={'small_arrow_right'} /></View>

        </Ripple>
        <View style={{ height: 36 }} />
        <Button
          type={ButtonType.primary}
          constraint={LayoutConstraint.matchParent}
          state={(isLoading || this.toggleNextButtonState()) ? ButtonState.disabled : ButtonState.idle}
          onPress={() => this.props.handleNextButton({ email, password })}
          disabled={isLoading || this.toggleNextButtonState()}
          text={"Đăng nhập"}
        />
        <View >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            paddingVertical: 36
          }}>
            <View style={{
              height: 1,
              width: 60,
              backgroundColor: Colors.black
            }} />
            <Text
              style={{
                ...Typography.option,
                color: Colors.black,
                marginHorizontal: 12
              }}>
              {"Hoặc"}
            </Text>
            <View style={{
              height: 1,
              width: 60,
              backgroundColor: Colors.black
            }} />
          </View>
          <Button
            text={'Đăng nhập bằng Facebook'}
            onPress={() => {
              this.props.setLoading(true);
              this.props.socialLogin('facebook');
            }}
            type={ButtonType.outlined}
            textStyle={{ color: Colors.black }}
            style={{ marginBottom: 16, borderRadius: Outlines.borderRadius.base }}
            color={Colors.black}
            constraint={LayoutConstraint.matchParent}
            prefixIcon={<Image style={{ width: 24, height: 24, marginRight: 12 }}
              source={require('_assets/images/social/Facebook/Facebook.png')} />}
          />
          {Platform.OS === 'ios' ? <Button
            text={'Đăng nhập bằng Apple'}
            onPress={() => {
              this.props.setLoading(true);
              this.props.socialLogin('apple');
            }}
            type={ButtonType.outlined}
            textStyle={{ color: Colors.black, }}
            style={{ marginBottom: 16, borderRadius: Outlines.borderRadius.base, }}
            color={Colors.black}
            constraint={LayoutConstraint.matchParent}
            prefixIcon={<Image style={{ width: 24, height: 24, marginRight: 12, }}
              source={require('_assets/images/social/Apple/Apple.png')} />}
          /> : null}
          {/* <Button
            text={'Đăng ký'}
            onPress={() => this.props.navigation.navigate('EmailSignUp')}
            type={ButtonType.flat}
            constraint={LayoutConstraint.matchParent}
            textStyle={{ color: Colors.text, textDecorationLine: 'underline' }}
            style={{ marginBottom: 12, }}
          /> */}
        </View>
      </View>
    );
  }
}
