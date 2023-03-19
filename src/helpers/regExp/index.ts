const RegExp = Object.freeze({
  RuFormatDate: /\d{2}:\d{2}:\d{2}/,
  EngFormatDate: /\d{1,}:\d{2}:\d{2}\s[AP]M/,
  FileFormat: /\w+\/\w+/gm,
  BlobFormat: /blob:.+/gm
})

export default RegExp;