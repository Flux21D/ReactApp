export function janrainCustomPasswordValidation(value) {
  return /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/.test(value);
}

export function janrainCustomPostalCodeValidation(value) {
  return /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) {0,1}[0-9][A-Za-z]{2})$/.test(value);
}