module.exports =  {
  required: ['long_link'],
  additionalProperties : false,
  properties: {
    long_link: {
      type: 'string',
      format: 'url'
    }
  }
};
