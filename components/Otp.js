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
    };
  }

  onOtpRequest = async() => {
    const { phone } = this.state;
    this.setState({
      hasError: null,
      otpRequestRespond: null,
      isOtpRequestLoading: true,
    });
    if(Otp.phoneNumberValidate(phone)) {
      const otpRequested = await getOtpCode(phone);
      if(otpRequested.ok) {
        this.setState({
          otpRequestRespond: otpRequested.data,
          isOtpRequestLoading: false,
        })
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

  render() {
    const {
      hasError,
      otpRequestRespond,
      isOtpRequestLoading,
    } =this.state;
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
            onChange={(e) => this.setState({ phone: e.target.value })}
            id="phoneNumber"
            placeholder="مثلا: ۰۹۱۲۳۰۶۳۸۵۵"
          />
        </section>
        <section>
          <label htmlFor="">رمز یکبار مصرف</label>
          <PinInput
            length={6}
            onChange={(value, index) => {console.log('has changed', value, index);}}
            type="numeric"
            onComplete={(value, index) => {console.log('completed', value, index);}}
          />
        </section>
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
                <button onClick={this.onOtpRequest}>
                  دریافت مجدد کد
                  <SvgPieTimer
                    height={20}
                    width={20}
                    duration={4000}
                    loops={1}
                    reverse={false}
                    inverse={false}
                  />
                </button>
                <button onClick={this.onSubmitCode}>
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
