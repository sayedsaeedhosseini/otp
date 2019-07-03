import fetch from 'isomorphic-unfetch';

export const getOtpCode = async (phone) => {
  const request = fetch('https://pydtest.com/api/web/login/phone', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone
    }),
  });

  const resp = await request;
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

export const submitOtpCode = async (phone, code) => {
  const request = fetch('https://pydtest.com/api/web/login/code', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      code,
    }),
  });

  const resp = await request;
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
