// import * as Facebook from 'expo-facebook';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { Logger } from 'services/log';
import { getUserName, updateUserName } from 'services/api/user/user.api';
import { appleSignInCreate, connectFacebookToken, getOrCreateServerTokenWithFBToken, getUserInfoFromFacebook,} from 'services/api/auth/authAPI';
import { generateRandomNumber } from 'utils/helper/FormatHelper';
import { signUp } from './auth.services';

export const facebookLogin = async (_currentToken: string = '') => {
  try {
    // need logout
    await LoginManager.logOut();
    const { type, token: FBToken } = await LoginManager.logInWithPermissions([
      'public_profile',
    ]).then(async function (result) {
      if (result.isCancelled) {
        return { type: 'cancel' };
      } else {
        const token = await AccessToken.getCurrentAccessToken().then((data) => {
          return data.accessToken;
        });
        return { token };
      }
    })
    console.log('2. FACEBOOK LOGIN: ' + type + FBToken);
    if (type === 'cancel') {
      return {
        message: _currentToken ? 'Đã huỷ liên kết' : 'Đã huỷ đăng nhập',
      };
    } else if (_currentToken) {
      const { res, finalToken: serverToken } = await connectFacebookToken(
        _currentToken,
        FBToken,
      );
      console.log('3. SERVER TOKEN - FB CONNECT CURRENT ACCOUNT: ' + res + serverToken);
      if (res == 201 || res == 200) {
        return { token: serverToken };
      } else {
        return { message: res };
      }
    } else {
      // 3. CHECK SERVER TOKEN WITH FACEBOOK TOKEN & MAKE ACCOUNT FOR EMAIL
      const { name, id } = await getUserInfoFromFacebook(FBToken);
      const serverToken = await getOrCreateServerTokenWithFBToken(FBToken);
      console.log('3. SERVER TOKEN: ' + serverToken);
      if (serverToken) {
        const userName = await getUserName(serverToken);
        if (!userName) {
          updateUserName(serverToken, name); // Todo Basic Infomation 할때 만들어야함.
        }
        return { token: serverToken };
      } else {
        // 4. GET SERVER TOKEN
        const email = id + '@burningb.com';
        const password = generateRandomNumber(16);

        const { token: connectToken, message } = await signUp({
          email,
          name,
          password,
        });
        Logger.instance.logSignUp('facebook');
        console.log('4. SERVER TOKEN: ' + connectToken);
        // 6. CONNECT FB TOKEN WITH SERVER TOKEN
        if (connectToken) {
          const { res, finalToken: serverToken } = await connectFacebookToken(
            connectToken,
            FBToken,
          );
          console.log('5. SERVER TOKEN - FB TOKEN CONNECT: ' + res + serverToken);
          if (res == 201 || res == 200) {
            return { token: serverToken };
          } else {
            return { message: res };
          }
        } else {
          return { message };
        }
      }
    }
  } catch (error) {
    console.log(error);
    return { message: error?.message || error };
  }
};

// 2. GET TOKEN FROM FACEBOOK
export const appleLogin = async () => {
  try {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    })

    // get current authentication state for user
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    )

    console.log('1. APPLE LOGIN: ' + appleAuthRequestResponse);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const { identityToken: APPLEToken, fullName } = appleAuthRequestResponse;
      if (APPLEToken) {
        let name = ''
        if (fullName?.familyName && fullName?.givenName) {
          name = fullName.givenName + " " + fullName.familyName
        }
        console.log('2. APPLE SIGN IN - SEND APPLE TOKEN');
        const { res, message, finalToken: serverToken } = await appleSignInCreate(
          APPLEToken,
          name,
        );
        console.log('3. SERVER TOKEN - SIGN IN SUCCESS: ' + res + " - " + serverToken);
        if (res == 201 || res == 200) {
          return { token: serverToken };
        } else {
          return { message: message };
        }
      }
    }
  } catch (error) {
    if (error.code == appleAuth.Error.CANCELED) {
      return { message: 'Đăng nhập bằng Apple bị hủy' };
    } else {
      console.log(error);
      console.log(error.code);
      return { message: error.code };
    }
  }
};
