import weakPasswords from "./weakPasswords";

export default function checkPw(password: string): string | null {
  let score = 0;

  for (const weak of weakPasswords) {
    if (password === weak) {
      score -= 1;
      return "Dieses Passwort ist unter den 500 meistgenutzten Passwörtern, bitte wähle ein anderes";
    }
  }

  if (password.length >= 8) {
    score += 1;
  } else {
    return "Ihr Passwort braucht mind. 8 Zeichen";
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    return "Ihr Passwort braucht mind. einen Großbuchstaben";
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    return "Ihr Passwort braucht mind. einen Kleinbuchstaben";
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    return "Ihr Passwort braucht mind. eine Zahl";
  }

  if (/[!@#$%^&*(),.?":{}|<>_\[\]\\\/'`~+=-]/.test(password)) {
    score += 1;
  } else {
    return "Ihr Passwort braucht mind. ein Sonderzeichen";
  }

  if (/([a-zA-Z0-9])\1{2,}/.test(password)) {
    score -= 1;
    return "Ihr Passwort darf nicht mehr als zwei gleiche hintereinander stehende Zeichen enthalten";
  }

  const sequentialPatterns = [
    "123",
    "234",
    "345",
    "456",
    "567",
    "678",
    "789",
    "890",
    "abc",
    "abcd",
    "bcde",
    "cdef",
    "defg",
    "efgh",
    "fghi",
    "ghij",
    "hijk",
    "ijkl",
    "jklm",
    "klmn",
    "lmno",
    "mnop",
    "nopq",
    "opqr",
    "pqrs",
    "qrst",
    "rstu",
    "stuv",
    "tuvw",
    "uvwx",
    "vwxy",
    "wxyz",
  ];

  for (const pattern of sequentialPatterns) {
    if (password.toLowerCase().includes(pattern)) {
      score -= 1;
      return `Ihr Passwort darf keine aufeinanderfolgende Zeichenfolge wie '${pattern}' enthalten`;
    }
  }

  switch (score) {
    case 5:
      return "Starkes Passwort!";
    case 4:
      return "Gutes Passwort.";
    case 3:
      return "Mittleres Passwort";
    case 2:
      return "Schwaches Passwort";
    default:
      return "Super krasses schwaches Passwort";
  }
}
