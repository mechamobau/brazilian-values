/**
 * Performs LTR (Left-To-Reft) function composition.
 * @example
 * const getName = pipe(
 *   (user: User) => [user.firstName, user.lastName],
 *   ([firstName, lastName]: [string, string]) => `${firstName} ${lastName}`
 * );
 *
 * getName({ firstName: 'Marcos', lastName: 'Vinícius' });
 * //=> "Marcos Vinícius"
 * @param {Array.<function(*):*>} fns - Functions to be composed.
 * @returns {function(*):*}
 */
// prettier-ignore
const pipe: {
    <A>(): (value: A) => A;
    <A, B>(fn1: (value: A) => B): (value: A) => B;
    <A, B, C>(fn1: (value: A) => B, fn2: (value: B) => C): (value: A) => B;
    <A, B, C, D>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D): (value: A) => D;
    <A, B, C, D, E>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D, fn4: (value: D) => E): (value: A) => E;
    <A, B, C, D, E, F>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D, fn4: (value: D) => E, fn5: (value: E) => F): (value: A) => F;
    <A, B, C, D, E, F, G>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D, fn4: (value: D) => E, fn5: (value: E) => F, fn6: (value: F) => G): (value: A) => G;
  } = (...fns: Function[]) => (value: any) =>
    fns.reduce((value, fn) => fn(value), value);

/**
 * Return if the value have the lenght needed to validate the boleto
 * 44 - without DV (Dígito verificador) 
 * 47 - with DV (Dígito verificador)
 * @param value - The number o LD (Linha digitável) of Boleto
 */
const isLenghtEnought = (value: string) => value.length === 47 || value.length === 44  ? value : false;

/**
 * Return a new array set with values from string to integer
 * @param arrString - Array with values of type String
 */
const parseArrayStringToInt = (arrString: Array<string>) => arrString.map((value) => parseInt(value));

/**
 * Split the string into an array and return a piece of array
 * @param initialIndex - initial index to be sliced
 * @param finalIndex - final index to be sliced
 */
const sliceStringIntoArray = (initialIndex: number, finalIndex: number) => (value: string) =>  value.split("").slice(initialIndex, finalIndex);

/**
 * Sum every digit of a number, e.g.:
 * (123456) => 1 + 2 + 3 + 4 + 5 + 6
 * @param value - Number to be used for sum
 */
const sumEveryDigitOfANumber = (value: number) => parseArrayStringToInt(value.toString().split("")).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

const checkSum = (value: Array<number>) => value.reduceRight((previousValue, currentValue, currentIndex) => {
    const multiplier = currentIndex % 2 == 0 ? 2 : 1;
    const result = currentValue * multiplier;
    return previousValue + (result < 10 ? result : sumEveryDigitOfANumber(result));
}, 0);

const module10 = (value: number) => value % 10;

const findNextTen = (value: number) => Math.ceil(value / 10) * 10;

const validateDV = (initialIndex: number, finalIndex: number) => (value: string) => 
    checkSum(parseArrayStringToInt(sliceStringIntoArray(initialIndex, finalIndex)(value)));

const isBoleto = (value: string) => [
    isLenghtEnought(value),
    validateDV(0, 8)(value),
    validateDV(10, 19)(value),
    validateDV(21, 30)(value)
].reduce((_, fn) => fn, false);

// const isBoleto = pipe(
//     isLenghtEnought,
//     validateDV(0, 8),
//     validateDV(10, 19),
//     validateDV(21, 30)
// )
export default isBoleto;