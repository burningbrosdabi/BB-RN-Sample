import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';
import React, { Component } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Colors, Outlines, Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { errorTranslation } from 'styles/legacy/translations';
import AgreementField from '../AgreementField';



class EmailSignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validEmail: false,
      validName: false,
      validPassword: false,
      errorEmail: '',
      errorPassword: '',
      errorName: '',
      email: '',
      name: '',
      password: '',
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);

    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message && this.props.message) {
      const { message } = this.props
      if (message.email?.length > 0) {
        this.setState({ errorEmail: "Người dùng với email này đã tồn tại." }) //message.email[0]
      } else if (message.name?.length > 0) {
        this.setState({ errorName: message.name[0] })
      } else if (message.password?.length > 0) {
        this.setState({ errorPassword: message.password[0] })
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
  onEndEditingName = () => {
    const { validName, name } = this.state;
    if (!validName && name !== '') {
      this.setState({ errorName: "Tên phải dài hơn 3 kí tự" })
    } else {
      this.setState({ errorName: "" })
    }
  }

  handleEmailChange(email) {
    const emailCheckRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    this.setState({ email: email });
    if (emailCheckRegex.test(email)) {
      this.setState({ validEmail: true, errorEmail: "" });
    } else if (email && !emailCheckRegex.test(email)) {
      this.setState({ validEmail: false, errorEmail: "Email không hợp lệ" });
    } else {
      this.setState({ errorEmail: "" });
    }
  }
  handleNameChange(name) {
    this.setState({ name });
    if (name.length >= 4) {
      this.setState({ validName: true, errorName: "" });
    } else if (name && name.length < 4) {
      this.setState({ validName: false, errorName: "Tên phải dài hơn 3 kí tự" });
    } else {
      this.setState({ errorName: "" });
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
    const { validEmail, validPassword, validName } = this.state;
    if (validEmail && validPassword && validName) {
      return false;
    }
    return true;
  }

  render() {
    const { isLoading, validEmail, validPassword, validName, email, password, name, errorEmail, errorPassword, errorName } = this.state;
    const { inputField, titleText, errorText } = styles;

    return (
      <View>
        <DEPRECATED_InputField
          labelText="Email"
          labelTextSize={theme.FONT_SIZE_12}
          labelColor={theme.BLACK}
          textColor={Colors.text}
          borderBottomColor={theme.PRIMARY_COLOR}
          inputType="email"
          customStyle={{ marginBottom: 24 }}
          autoCapitalize={'none'}
          showCheckmark={validEmail}
          onChangeText={this.handleEmailChange}
          comment="Nhập email của bạn"
          editable={!this.state.isLoading}
          autoFocus
          errorMsg={errorEmail}
          maxLength={40} //Max number according to gmail (30 chars + @gmail.com)
        // onEndEditing={this.onEndEditingEmail}
        />
        <DEPRECATED_InputField
          labelText="Tên"
          labelTextSize={theme.FONT_SIZE_12}
          labelColor={theme.BLACK}
          textColor={Colors.text}
          borderBottomColor={theme.PRIMARY_COLOR}
          inputType="text"
          customStyle={{ marginBottom: 24 }}
          autoCapitalize={'none'}
          showCheckmark={validName}
          onChangeText={this.handleNameChange}
          editable={!this.state.isLoading}
          comment="Nhập tên của bạn"
          errorMsg={errorName}
          maxLength={30}
        // onEndEditing={this.onEndEditingName}
        />
        <DEPRECATED_InputField
          labelText="Mật khẩu"
          labelTextSize={theme.FONT_SIZE_12}
          labelColor={theme.BLACK}
          textColor={Colors.text}
          borderBottomColor={theme.PRIMARY_COLOR}
          inputType="password"
          customStyle={{ marginBottom: 36 }}
          autoCapitalize={'none'}
          showCheckmark={validPassword}
          onChangeText={this.handlePasswordChange}
          editable={!this.state.isLoading}
          comment="Mật khẩu phải dài hơn 7 kí tự"
          errorMsg={errorPassword}
        // onEndEditing={this.onEndEditingPass}
        />
        {this.props.signup_error ? (
          <Text style={errorText}>{errorTranslation[this.props.signup_error[0]]}</Text>
        ) : null}
        <Button
          type={ButtonType.primary}
          state={(isLoading || this.toggleNextButtonState()) ? ButtonState.disabled : ButtonState.idle}
          onPress={() => this.props.handleNextButton({ email, name, password })}
          disabled={isLoading || this.toggleNextButtonState()}
          text={"Đăng ký"}
        />
        <View style={{ marginTop: 24 }}>
          <AgreementField />
        </View>
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
        </View>
      </View>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    signup_error: auth.signup_error,
    success: auth.success,
    token: auth.token,
  };
}

export default connect(mapStateToProps)(EmailSignUpScreen);

const styles = StyleSheet.create({
  errorText: {
    color: theme.PRIMARY_COLOR,
    marginTop: theme.MARGIN_10,
    marginBottom: theme.MARGIN_5,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: 'white',
    paddingBottom: 30,
  },
});
