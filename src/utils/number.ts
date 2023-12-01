export const numberWithCommas = (num: string) => {
  const [integerPart, decimalPart] = num.split('.');
  const formattedIntegerPart = (integerPart === '' ? '0' : integerPart).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );
  const formattedDecimalPart = decimalPart !== undefined ? `.${decimalPart}` : '';
  return `${formattedIntegerPart}${formattedDecimalPart}`;
};
