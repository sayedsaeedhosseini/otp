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
      isOtpRequestLoading: false,
      otpRequestRespond: null,
      isOtpResendButtonActive: false,
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
    const codeSubmitted = await submitOtpCode('09123063855', '5597');
    console.log('------- codeSubmitted logging ------');
    console.log(codeSubmitted);
    console.log('------- end ------');
  };

  onPhoneNumberChanged = (e) => {
    this.setState({
      hasError: null,
      otpRequestRespond: null,
      isOtpResendButtonActive: false,
      phone: e.target.value,
    });
  };

  render() {
    const {
      hasError,
      otpRequestRespond,
      isOtpRequestLoading,
      isOtpResendButtonActive,
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
              onChange={(value, index) => {console.log('has changed', value, index);}}
              type={otpRequestRespond.data.charType === 'DIGIT' ? 'numeric' : 'custom'}
              onComplete={(value, index) => {console.log('completed', value, index);}}
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
