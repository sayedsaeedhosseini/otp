import React from "react";

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
