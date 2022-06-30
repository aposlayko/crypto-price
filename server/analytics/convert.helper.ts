export function convertTextToNumber(value: string): number {
  return Number(value.replace(/\s/gi, "").replace(",", "."));
}

export function convertNumberToText(value: number): string {
  return value.toString().replace(".", ",");
}
