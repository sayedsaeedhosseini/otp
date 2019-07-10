import React from "react";
import Layout from '../components/Layout.js';

function listing(result) {
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
          {result.data.notification.message}
        </p>
      }
    </Layout>
  )
}

listing.getInitialProps = async ({ req }) => {
  const resp = await fetch('https://pydtest.com/api/web/explore/categories/popular');
  let data;
  if (resp.ok || resp.status < 500) {
    data = await resp.json();
  }
  return {
    ok: resp.ok,
    status: resp.status,
    data,
  };
};

export default listing;
