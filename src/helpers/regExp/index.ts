const RegExp = {
  RuFormatDate: /\d{2}:\d{2}:\d{2}/,
  EngFormatDate: /\d{1,}:\d{2}:\d{2}\s[AP]M/,
  TimeRegisteredEng: /\w+\s\w+,\s\d+/gm,
  TimeRegisteredRu: /\d+\w+.+/gm,
  FileFormat: /\w+\/\w+/gm,
  BlobFormat: /blob:.+/gm
} as const;

export default RegExp;