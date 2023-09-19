export function enumToArray<T>(enumeration: T): { name: string; value: T }[] {
  const enumValues = Object.keys(enumeration)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({ name: key, value: enumeration[key] }));

  return enumValues;
}
