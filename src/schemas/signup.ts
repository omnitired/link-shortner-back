module.exports =  {
  required: ['email', 'password', 'username'],
  additionalProperties : false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    username: {
      type: 'string',
      format: 'username',
      minLength: 3,
    },
  }
};
