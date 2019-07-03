import React from "react";
import PinInput from 'react-pin-input';

class Otp extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <div>
        <section>
          <div>
            <h2>ورود</h2>
            <p>ابتدا شماره تلفن همراه خود را وارد کنید، سپس رمز یکبار مصرف را برای تایید شماره جهت ورود وارد کنید.</p>
          </div>
          <label htmlFor="phoneNumber">شماره تلفن همراه</label>
          <input id="phoneNumber" placeholder="مثلا: ۰۹۱۲۳۰۶۳۸۵۵" />
        </section>
        <section>
          <label htmlFor="">رمز یکبار مصرف</label>
          <PinInput
            length={4}
            initialValue=""
            secret
            onChange={(value, index) => {console.log('has changed', value, index);}}
            type="numeric"
            style={{padding: '10px'}}
            inputStyle={{borderColor: 'red'}}
            inputFocusStyle={{borderColor: 'blue'}}
            onComplete={(value, index) => {console.log('completed', value, index);}}
          />
        </section>
        <section>
          <button>
            دریافت کد
          </button>
          <button>
            دریافت مجدد کد
          </button>
          <button>
            ورود
          </button>
        </section>
      </div>
    );
  }
}

export default Otp;
