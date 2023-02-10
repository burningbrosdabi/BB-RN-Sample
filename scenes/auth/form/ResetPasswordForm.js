import { Button, ButtonState, ButtonType } from 'components/button/Button';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from 'styles';
import theme from '_styles/legacy/theme.style';
import DEPRECATED_InputField from "components/inputs/InputField.v2";

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      validPassword: false,
      errorPassword: '',
      errorConfirmPass: '',
    };

    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message && this.props.message) {
      if (this.props.message.password?.length > 0) {
        this.setState({ errorPassword: "Mật khẩu này quá phổ biến" }) // this.props.message.password[0]
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
  onEndEditingConfirmPass = () => {
    const { password, confirmPassword } = this.state;
    if (password !== '' && confirmPassword !== '' && password !== confirmPassword) {
      this.setState({ errorConfirmPass: "Mật khẩu không khớp" })
    } else {
      this.setState({ errorConfirmPass: "" })
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

  handleConfirmPasswordChange(confirmPassword) {
    this.setState({ confirmPassword });
    const { password } = this.state

    if (password !== '' && confirmPassword !== '' && password !== confirmPassword) {
      this.setState({ errorConfirmPass: "Mật khẩu không khớp" })
    } else {
      this.setState({ errorConfirmPass: "" })
    }
  }

  toggleNextButtonState() {
    const { validPassword, password, confirmPassword } = this.state;
    if (validPassword && password === confirmPassword) {
      return false;
    }
    return true;
  }

  render() {
    const { title, buttonTitle, handleNextButton } = this.props
    const { validPassword, password, confirmPassword, errorPassword, errorConfirmPass } = this.state;
    const { inputField, titleText } = styles;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 12 }} />
        <Text style={titleText}>{title}</Text>
        <View style={{ height: 24 }} />
        <DEPRECATED_InputField
          labelText="Mật khẩu mới"
          labelTextSize={theme.FONT_SIZE_12}
          labelColor={theme.BLACK}
          textColor={Colors.text}
          borderBottomColor={theme.PRIMARY_COLOR}
          inputType="password"
          customStyle={inputField}
          onChangeText={this.handlePasswordChange}
          showCheckmark={validPassword}
          autoCapitalize={'none'}
          comment="Mật khẩu phải dài hơn 7 kí tự"
          errorMsg={errorPassword}
          background={Colors.background}
        // onEndEditing={this.onEndEditingPass}
        />
        <DEPRECATED_InputField
          labelText="Nhập lại mật khẩu"
          labelStyle={{ flex: 0.4 }}
          errorStyle={{ flex: 0.6 }}
          labelTextSize={theme.FONT_SIZE_12}
          labelColor={theme.BLACK}
          textColor={Colors.text}
          borderBottomColor={theme.PRIMARY_COLOR}
          inputType="password"
          customStyle={inputField}
          onChangeText={this.handleConfirmPasswordChange}
          showCheckmark={password !== '' && password === confirmPassword}
          autoCapitalize={'none'}
          comment="Mật khẩu phải dài hơn 7 kí tự"
          errorMsg={errorConfirmPass}
          background={Colors.background}
        // onEndEditing={this.onEndEditingConfirmPass}
        />
        <View style={{ flex: 1 }} />
        <View style={{ width: '100%', height: 48 }}>
          <Button
            type={ButtonType.primary}
            state={this.toggleNextButtonState() ? ButtonState.disabled : ButtonState.idle}
            onPress={() => handleNextButton({ password })}
            disabled={this.toggleNextButtonState()}
            text={buttonTitle}
          />
        </View>
      </View>
    );
  }
}

export default ResetPasswordForm;

const styles = StyleSheet.create({
  inputField: { marginBottom: theme.MARGIN_20 },
  titleText: {
    ...Typography.title,
  },
  nextButton: {
    paddingBottom: (40 - (14 - 8) / 2) * Spacing.AUTH_RATIO_H,
    backgroundColor: 'white',
    paddingTop: 12,
  },
});
