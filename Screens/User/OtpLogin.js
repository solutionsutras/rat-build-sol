import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'native-base';

import FormContainer from '../../Shared/Forms/FormContainer';
import Input from '../../Shared/Forms/Input';
import Error from '../../Shared/Error';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

// Context
import AuthGlobal from '../../Context/store/AuthGlobal';
import { otpLoginUser } from '../../Context/actions/Auth.actions';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import { colors } from '../../assets/global/globalStyles';
var { height } = Dimensions.get('window');

var frm = '';

const OtpLogin = (props) => {
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
  const [smsExpTime, setSmsExpTime] = useState(3600);
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate('User Profile');
    }
  }, [context.stateUser.isAuthenticated]);

  useEffect(() => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setRandomOtp(otp);
  }, []);

  
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

  const verifyOtp = () => {
    if (smsDbRec) {
      const currentDateTime = new Date();
      const dbDate = new Date(smsDbRec.dateCreated);
      const timeOut = new Date(dbDate.getTime() + smsExpTime * 60000);

      if (currentDateTime > timeOut) {
        setOtpExpired(true);
        alert('OTP Expired !!! Please resend the code');
      } else {
        setOtpExpired(false);
        // console.log('userFound: ', userFound[0]);
        // console.log('randomOtp: ', randomOtp);
        const user = {
          userId: userFound[0].phone,
          password: userFound[0].passwordHash,
        };
        console.log(user);
        otpLoginUser(user, context.dispatch);
        if (parseInt(smsDbRec.otp) === randomOtp) {
          otpLoginUser(user, context.dispatch);
        }
      }
    }
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
            <Input
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
          <Text>Enter the OTP sent to your mobile no</Text>
          <Input
            placeholder={'XXXXXX'}
            name={'OtpInput'}
            value={otpInput}
            keyboardType={'numeric'}
            onChangeText={(text) => setOtpInput(text)}
          />
          {otpExpired ? (
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
      )}
    </FormContainer>
  );
};

export default OtpLogin;

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: 'white',
    borderColor: colors.buttons,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 18,
  },
});
