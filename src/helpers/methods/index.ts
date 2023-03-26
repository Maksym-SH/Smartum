export const ObjectFull = (object: object): boolean => {
  return Object.values(object).every((item) => item);
}

export const ObjectEmpty = (object: object): boolean => {
  return Object.keys(object).length > 0;
}
