import React from "react";
import Router from "next/dist/client/router";
import Layout from '../components/Layout.js';

class listing extends React.Component {

  componentDidMount() {
    const isUserLoggedIN = !!sessionStorage.getItem('accessToken');
    if (!isUserLoggedIN) {
      Router.push({
        pathname: '/',
      });
      window.location.href = '/';
    }
  }

  render() {
    const { result } = this.props;
    return (
      <Layout>
        {
          (result && result.ok) &&
          result.data.data.map(
            (item) => <p key={item._id}>{item.name}</p>
          )
        }
        {
          (result && !result.ok) &&
          <p>
            مشکلی پیش آمده است نازنینم.
            {
              result.status >= 500
                ? 'مشکلی در بر قراری ارتباط با سرور پیش آمده است. لطفا مجدد تلاش کنید.'
                : result.data.notification.message
            }
          </p>
        }
      </Layout>
    )
  }
}

listing.getInitialProps = async ({ req }) => {
  const resp = await fetch('https://pydtest.com/api/web/explore/categories/popular');
  let data;
  if (resp.ok || resp.status < 500) {
    data = await resp.json();
  }
  return {
    result: {
      ok: resp.ok,
      status: resp.status,
      data,
    }
  };
};

export default listing;
