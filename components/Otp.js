import React from "react";
import PinInput from 'react-pin-input';
import { getOtpCode, submitOtpCode } from '../utils/api_helper';
import { PulseLoader } from 'react-spinners';
import SvgPieTimer from '../components/SvgPieTimer/SvgPieTimer';

class Otp extends React.Component {

  static phoneNumberValidate (phone) {
    const path = /^((0)[0-9]{10})$/g;
    return path.test(phone);
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      phone: null,
      hasError: null,
      otpCode: null,
      otpRequestRespond: null,
      isOtpRequestLoading: false,
      isOtpResendButtonActive: false,
      isOtpSubmittedLoading: false,
    };
    this.resendButtonTimeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.resendButtonTimeout);
  }

  activeResendOtpButton = () => {
    this.resendButtonTimeout = setTimeout(() => {
      this.setState({
        isOtpResendButtonActive: true,
      });
    }, this.state.otpRequestRespond.data.cooldownDuration * 1000)
  };

  onOtpRequest = async() => {
    const { phone } = this.state;
    this.setState({
      hasError: null,
      otpCode: null,
      otpRequestRespond: null,
      isOtpRequestLoading: true,
      isOtpResendButtonActive: false,
    });
    if(Otp.phoneNumberValidate(phone)) {
      const otpRequested = await getOtpCode(phone);
      if(otpRequested.ok) {
        this.setState({
          otpRequestRespond: otpRequested.data,
          isOtpRequestLoading: false,
        }, this.activeResendOtpButton);
      } else {
        this.setState({
          hasError: otpRequested.data.notification.message,
          isOtpRequestLoading: false,
        });
      }
    } else {
      this.setState({
        isOtpRequestLoading: false,
        hasError: 'لطقا شماره تلفن همراه معتبر وارد نمایید',
      });
    }
  };

  onSubmitCode = async() => {
    const {
      phone,
      otpCode,
      otpRequestRespond,
    } = this.state;
    this.setState({
      hasError: null,
      isOtpSubmittedLoading: true,
    });
    if (otpCode.length === otpRequestRespond.data.charCount) {
      const codeSubmitted = await submitOtpCode(phone, otpCode);
      console.log('------- codeSubmitted logging ------');
      console.log(codeSubmitted);
      console.log('------- end ------');
      if(codeSubmitted.ok) {
        this.setState({
          isOtpSubmittedLoading: false,
        }, this.OtpSubmitted);
      } else {
        this.setState({
          hasError: codeSubmitted.data.notification.message || 'متاسفانه خطایی پیش آمده است. مجدد تلاش کنید.',
          isOtpSubmittedLoading: false,
        });
      }
    } else {
      this.setState({
        isOtpSubmittedLoading: false,
        hasError: 'لطقا رمز یکبار مصرف را صحیح وارد نمایید.',
      });
    }
  };

  OtpSubmitted = () => {
    console.log('-------  It`s redirecting ------');
  };

  onPhoneNumberChanged = (e) => {
    this.setState({
      hasError: null,
      otpRequestRespond: null,
      isOtpResendButtonActive: false,
      otpCode: null,
      phone: e.target.value,
    });
  };

  render() {
    const {
      hasError,
      otpRequestRespond,
      isOtpRequestLoading,
      isOtpResendButtonActive,
      isOtpSubmittedLoading,
    } = this.state;
    console.log('------- this logging ------');
    console.log(this);
    console.log('------- end ------');
    return (
      <div>
        <section>
          <div>
            <h2>ورود</h2>
            <p>ابتدا شماره تلفن همراه خود را وارد کنید، سپس رمز یکبار مصرف را برای تایید شماره جهت ورود وارد کنید.</p>
          </div>
          <label htmlFor="phoneNumber">شماره تلفن همراه</label>
          <input
            onChange={(e) => this.onPhoneNumberChanged(e)}
            id="phoneNumber"
            placeholder="مثلا: ۰۹۱۲۳۰۶۳۸۵۵"
          />
        </section>
        {
          otpRequestRespond &&
          <section>
            <label htmlFor="">رمز یکبار مصرف</label>
            <PinInput
              length={otpRequestRespond.data.charCount}
              onChange={(value) => {this.setState({ otpCode: value, hasError: null })}}
              type={otpRequestRespond.data.charType === 'DIGIT' ? 'numeric' : 'custom'}
            />
          </section>
        }
        <section>
          {
            otpRequestRespond === null &&
            <button onClick={this.onOtpRequest}>
              دریافت کد
              <PulseLoader
                sizeUnit={"px"}
                size={10}
                color={'#123abc'}
                loading = {isOtpRequestLoading}
              />
            </button>
          }
          {
            otpRequestRespond &&
              <div>
                <button
                  onClick={this.onOtpRequest}
                  disabled={isOtpResendButtonActive ? false : 'disabled'}
                >
                  دریافت مجدد کد
                  <SvgPieTimer
                    height={20}
                    width={20}
                    duration={otpRequestRespond.data.cooldownDuration*1000}
                    loops={1}
                    reverse={false}
                    inverse={false}
                  />
                </button>
                <button
                  onClick={this.onSubmitCode}
                >
                  ورود
                  <PulseLoader
                    sizeUnit={"px"}
                    size={10}
                    color={'#123abc'}
                    loading = {isOtpSubmittedLoading}
                  />
                </button>
              </div>
          }
        </section>
        {
          !!hasError &&
          <section>
            <p>{ hasError }</p>
          </section>
        }
      </div>
    );
  }
}

export default Otp;
