import React from "react";
import Layout from '../components/Layout.js';

function listing(result) {
  console.log('------- respond logging ------');
  console.log(result);
  console.log('------- end ------');
  return (
    <Layout>
      this is listing
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
