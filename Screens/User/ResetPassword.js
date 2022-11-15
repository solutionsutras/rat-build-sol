import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Button } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import EasyButton from '../../Shared/StyledComponents/EasyButton';
import FormContainer from '../../Shared/Forms/FormContainer';
import Input from '../../Shared/Forms/Input';
import Error from '../../Shared/Error';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';
// Context
import AuthGlobal from '../../Context/store/AuthGlobal';
import { otpLoginUser } from '../../Context/actions/Auth.actions';
import { colors } from '../../assets/global/globalStyles';

var { height } = Dimensions.get('window');

const ResetPassword = (props) => {
  const context = useContext(AuthGlobal);
  const [userName, setUserName] = useState();
  const [phone, setPhone] = useState('7504705571');
  const [error, setError] = useState();
  const [fromNav, setFromNav] = useState();
  const [otpInput, setOtpInput] = useState();
  const [randomOtp, setRandomOtp] = useState(0);
  const [otpSent, setOtpSent] = useState();
  const [senderId, setSenderId] = useState('FTWSMS');
  const [message, setMessage] = useState('YOUR OTP:');
  const [route, setRoute] = useState('otp');
  const [otpStatus, setOtpStatus] = useState(1);
  const [smsDbRec, setSmsDbRec] = useState();
  const [userFound, setUserFound] = useState();
  const [smsExpTime, setSmsExpTime] = useState(1);
  const [otpMatched, setOtpMatched] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate('User Profile');
    }
  }, [context.stateUser.isAuthenticated]);

  useEffect(() => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setRandomOtp(otp);
  }, []);

  const sendSms = () => {
    if (phone === '' || !(phone.length == 10)) {
      setError('Please enter a valid phone no');
    } else {
      // const otp = Math.floor(100000 + Math.random() * 900000);
      // setRandomOtp(otp);
      axios
        .get(`${baseUrl}users/getbynum/${phone}`)
        .then((res) => {
          const resData = res.data;
          setUserFound(resData);
          if (resData) {
            sendOtpSms();
          }
        })
        .catch((error) => {
          console.log(error);
          alert('This number is not registered with us');
        });
    }
  };

  // Function to send SMS through thr SMS Gateway
  const sendOtpSms = () => {
    const data = {
      sender_id: senderId,
      message: message,
      variables_values: randomOtp,
      route: route,
      numbers: phone,
    };

    console.log(data);

    const config = {
      headers: {
        Authorization: `pdHqa6T9kPNlYrcInUo2WM4OuzSDbKZJgChmQFivxEXe7Ly1B5oqagh3vTCWf0u5nNewzptkOVxbQ4FG`,
      },
    };

    axios
      .post(`https://www.fast2sms.com/dev/bulkV2`, data, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          const smsSent = res.data;
          setOtpSent(smsSent);
          saveOtpRec();
        }
      })
      .catch((error) => {
        console.log('2 error while sending sms: ', error);
      });
  };

  const saveOtpRec = () => {
    // Insert a record in otpsms db
    let otpSmsRec = {
      sender_id: senderId,
      message: message,
      otp: randomOtp,
      route: route,
      number: phone,
      status: otpStatus,
    };

    axios
      .post(`${baseUrl}otpsms`, otpSmsRec)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setSmsDbRec(res.data);
        }
      })
      .catch((error) => {
        console.log('Error while saving otp record', error);
      });
  };

  const verifyOtp = () => {
    if (smsDbRec) {
      if (currentDateTime > timeOut) {
        setOtpVerified(false);
        setOtpExpired(true);
        setResendOtp(true);
        // Update otp record status to 2, i.e, Expired
        let otpSmsRec = {
          sender_id: senderId,
          message: message,
          otp: randomOtp,
          route: route,
          number: phone,
          status: '2',
        };
        axios
          .put(`${baseUrl}otpsms/${id}`, otpSmsRec)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              setSmsDbRec(res.data);
            }
          })
          .catch((error) => {
            console.log('Error while updating otp record', error);
          });
        alert('OTP Expired !!! Please resend the code');
      } else {
        // Check the OTP enetered with the sent OTP
        if (otpInput !== smsDbRec.otp) {
          // OTP not matched
          setOtpVerified(false);
          alert('Incorrect OTP Entered !!! Please enter correct OTP');
        } else {
          // OTP matched
          setOtpVerified(true);
          setOtpExpired(false);
          setResendOtp(false);

          // Update otp record status to 1, i.e, verified
          let otpSmsRec = {
            sender_id: senderId,
            message: message,
            otp: randomOtp,
            route: route,
            number: phone,
            status: '1',
          };
          axios
            .put(`${baseUrl}otpsms/${id}`, otpSmsRec)
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                setSmsDbRec(res.data);
              }
            })
            .catch((error) => {
              console.log('Error while updating otp record', error);
            });
        }
      }
    }
  };

  const updatePassword = () => {
    console.log('In updatePassword');
    console.log('newPassword: ', newPassword);
    console.log('confirmNewPassword: ', confirmNewPassword);
  };

  return (
    <FormContainer title={''} style={{ height: height }}>
      {!otpSent ? (
        <View style={styles.buttonGroup}>
          <Text>Enter Phone Number</Text>
          <View style={styles.phoneNo}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder={'Phone'}
              name={'Phone'}
              value={phone}
              keyboardType={'numeric'}
              onChangeText={(text) => setPhone(text)}
            />
          </View>

          <View>
            {error ? <Error message={error} /> : null}
            <EasyButton large primary onPress={() => sendSms()}>
              <Text style={{ color: 'white' }}>Send OTP</Text>
            </EasyButton>
          </View>
        </View>
      ) : (
        <View style={styles.buttonGroup}>
          {!otpVerified ? (
            <View>
              <Text>Enter the OTP sent to your mobile no</Text>
              <Input
                placeholder={'XXXXXX'}
                name={'OtpInput'}
                value={otpInput}
                keyboardType={'numeric'}
                onChangeText={(text) => setOtpInput(text)}
              />
              {resendOtp ? (
                <TouchableOpacity onPress={() => sendSms()}>
                  <View style={{ marginVertical: 10 }}>
                    <Text
                      style={{
                        color: colors.buttons,
                        fontSize: 16,
                        textDecorationLine: 'underline',
                      }}
                    >
                      Resend Code
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              <EasyButton large primary onPress={() => verifyOtp()}>
                <Text style={{ color: 'white' }}>Submit</Text>
              </EasyButton>
            </View>
          ) : (
            <View>
              <Text>Enter new password</Text>
              <Input
                placeholder={'XXXXXX'}
                name={'NewPassword'}
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
              />

              <Text>Confirm new password</Text>
              <Input
                placeholder={'XXXXXX'}
                name={'ConfirmNewPassword'}
                value={confirmNewPassword}
                onChangeText={(text) => setConfirmNewPassword(text)}
              />

              <EasyButton large primary onPress={() => updatePassword()}>
                <Text style={{ color: 'white' }}>Save</Text>
              </EasyButton>
            </View>
          )}
        </View>
      )}

      <EasyButton
        large
        secondary
        onPress={() => props.navigation.navigate('Login')}
      >
        <Text style={{ color: 'white' }}>Back to Login</Text>
      </EasyButton>
    </FormContainer>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  buttonGroup: {
    marginTop: 40,
    width: '80%',
    alignItems: 'center',
  },
  betweenText: {
    marginTop: 20,
    marginBottom: 5,
    alignSelf: 'center',
  },
  inLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  input45: {
    width: '48%',
    height: 48,
    margin: 10,
    paddingLeft: 15,
  },
  inputNormal: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.buttons,
  },
  inputProtected: {
    backgroundColor: 'transparent',
  },
  normal18: { fontSize: 18 },
  bold18: { fontWeight: 'bold', fontSize: 18 },
  buttonGroup: {
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  betweenText: {
    marginTop: 20,
    marginBottom: 5,
    alignSelf: 'center',
  },
  phoneNo: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  countryCode: {
    backgroundColor: 'white',
    borderColor: colors.buttons,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 12,
    height: 42,
  },
  countryCodeText: {
    color: colors.grey1,
  },
  input: {
    width: '90%',
    height: 42,
    backgroundColor: 'white',
    marginTop: 0,
    marginBottom: 5,
    paddingLeft: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.buttons,
  },
});
