module.exports =  {
  required: ['password', 'login_key'],
  additionalProperties : false,
  properties: {
    login_key: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  }
};
