import { Button, ButtonState, ButtonType } from 'components/button/Button';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from 'styles';
import theme from '_styles/legacy/theme.style';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';

class SendEmailCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validEmail: false,
      email: '',
      errorEmail: '',
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message && this.props.message) {
      if (this.props.message.email?.length > 0) {
        this.setState({
          errorEmail: "Người dùng với email này không tồn tại.", //this.props.message.email
        })
      }
    }
  }

  onEndEditingEmail = () => {
    const { validEmail, email } = this.state;
    if (!validEmail && email !== '') {
      this.setState({ errorEmail: "Email không hợp lệ." })
    } else {
      this.setState({ errorEmail: "" })
    }
  }

  handleEmailChange(email) {
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
  toggleNextButtonState() {
    const { validEmail } = this.state;
    if (validEmail) {
      return false;
    }
    return true;
  }

  render() {
    const { title, buttonTitle, handleNextButton } = this.props
    const { validEmail, email, errorEmail } = this.state;
    const { inputField, titleText } = styles;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 12 }} />
        <Text style={titleText}>{title}</Text>
        <View style={{ height: 24 }} />
        <DEPRECATED_InputField
          labelText="Email"
          labelTextSize={theme.FONT_SIZE_12}
          textInputStyle={(errorEmail.includes("\n") && Platform.OS == 'ios') ? { marginBottom: 10 } : undefined}
          labelColor={theme.BLACK}
          textColor={Colors.text}
          borderBottomColor={theme.PRIMARY_COLOR}
          inputType="email"
          customStyle={inputField}
          onChangeText={this.handleEmailChange}
          showCheckmark={validEmail}
          autoCapitalize={'none'}
          comment="Nhập email của bạn"
          errorMsg={errorEmail}
          onEndEditing={this.onEndEditingEmail}
          background={Colors.background}
        />
        <View style={{ flex: 1 }} />
        <View style={{ width: '100%', height: 48 }}>
          <Button
            type={ButtonType.primary}
            state={this.toggleNextButtonState() ? ButtonState.disabled : ButtonState.idle}
            onPress={() => handleNextButton({ email })}
            disabled={this.toggleNextButtonState()}
            text={buttonTitle}
          />
        </View>
      </View>
    );
  }
}

export default SendEmailCode;

const styles = StyleSheet.create({
  inputField: { marginBottom: theme.MARGIN_20 },
  titleText: {
    ...Typography.title,
    color: Colors.black,
  },
  nextButton: {
    paddingBottom: (40 - (14 - 8) / 2) * Spacing.AUTH_RATIO_H,
    backgroundColor: 'white',
    paddingTop: 12,
  },
});
