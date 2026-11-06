/**
 * Datos de prueba.
 * Regla de contraseña asumida (juego "User Inyerface"): debe contener
 * una mayúscula, un dígito, una letra cirílica y parte del email (prefijo).
 * Si el sitio cambia la regla, ajusta buildPassword() y los flags.
 */

export const PREFIX = 'qauser';

export interface PwFlags { prefix: boolean; upper: boolean; digit: boolean; cyr: boolean }

export function buildPassword(f: PwFlags, prefix = PREFIX): string {
  return `${f.prefix ? prefix : 'zzzzzz'}${f.upper ? 'Q' : 'q'}${f.digit ? '7' : 'x'}${f.cyr ? 'ж' : 'y'}`;
}

const allFlags: PwFlags[] = [];
for (let i = 0; i < 16; i++) {
  allFlags.push({ prefix: !!(i & 1), upper: !!(i & 2), digit: !!(i & 4), cyr: !!(i & 8) });
}
/** 15 combinaciones donde falta al menos un requisito. */
export const INVALID_FLAG_COMBOS = allFlags.filter((f) => !(f.prefix && f.upper && f.digit && f.cyr));

/** Contraseñas inválidas "simples". */
export const WEAK_PASSWORDS = ['', ' ', 'a', 'abc', '123456', 'password', 'PASSWORD', 'qwerty', 'aaaaaaaa', '!!!!!!!!'];

/** Contraseñas válidas con distinta forma (siempre incluyen el prefijo del email). */
export const VALID_PASSWORDS = [
  'qauserQ7ж', 'Жqauser1Q', '9Qqauserд', 'qauserQ7жxyz', 'QqauserЯ5', 'qauser!Q1ё',
  'Aqauser2ю', 'qauserZ0ф', 'Wqauser3щ', 'qauserM8ъ',
];

/** Valores arbitrarios que el campo debe retener tal cual. */
export const PASSWORD_ECHO = [
  'a', 'abc', 'Abc123', 'qauserQ7ж', 'ПарольПароль', 'P@ssw0rd!', '   ', 'a b c', '1234567890',
  'ñandú2024', '漢字パスワード', 'emoji😀pass', 'UPPERCASE', 'lowercase', 'MiXeD123', 'x'.repeat(64),
  'x'.repeat(128), 'tab\tchar', 'quote"quote', "apos'trophe", '<script>x</script>', '%20%20', '\\backslash',
  'sql\' OR 1=1 --', 'a.b-c_d', '0', '00000', 'Zz9ж', 'long-ish-password-with-dashes-1Ж', '£€¥pass',
];

/** Prefijos de email que el campo debe retener. */
export const EMAIL_PREFIXES = [
  'qauser', 'a', 'ab', 'test', 'test.user', 'test_user', 'test-user', 'test+tag', 'UPPER', 'MiXeD', 'user123',
  '123456', 'x'.repeat(30), 'x'.repeat(64), 'john.doe', 'o.neil', 'ñandu', 'user!', 'user#', 'user$', 'user%',
  'user&', "user'", 'user*', 'user=',
];

/** Valores de dominio que el campo debe retener. */
export const DOMAINS = [
  'example', 'gmail', 'yahoo', 'outlook', 'hotmail', 'proton', 'icloud', 'mail', 'a', 'ab', 'x'.repeat(20),
  'x'.repeat(63), 'my-domain', 'my_domain', 'domain1', '123', 'UPPER', 'MiXeD', 'sub.domain', 'ñandu',
];

export interface Viewport { name: string; width: number; height: number }
export const VIEWPORTS: Viewport[] = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'Pixel 7', width: 412, height: 915 },
  { name: 'Galaxy S20', width: 360, height: 800 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Laptop 1280', width: 1280, height: 720 },
  { name: 'Laptop 1366', width: 1366, height: 768 },
  { name: 'Desktop 1440', width: 1440, height: 900 },
  { name: 'Desktop 1920', width: 1920, height: 1080 },
  { name: 'QHD 2560', width: 2560, height: 1440 },
  { name: 'Landscape phone', width: 844, height: 390 },
];

export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 Version/17 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36',
  'curl/8.4.0',
];

export const FILE_TYPES = [
  { name: 'avatar.png', mime: 'image/png' },
  { name: 'avatar.jpg', mime: 'image/jpeg' },
  { name: 'avatar.jpeg', mime: 'image/jpeg' },
  { name: 'avatar.gif', mime: 'image/gif' },
  { name: 'avatar.webp', mime: 'image/webp' },
  { name: 'avatar.bmp', mime: 'image/bmp' },
  { name: 'mi foto con espacios.png', mime: 'image/png' },
  { name: 'ñandú.png', mime: 'image/png' },
  { name: 'AVATAR.PNG', mime: 'image/png' },
  { name: 'a.png', mime: 'image/png' },
  { name: 'x'.repeat(100) + '.png', mime: 'image/png' },
  { name: 'doc.txt', mime: 'text/plain' },
  { name: 'doc.pdf', mime: 'application/pdf' },
  { name: 'archive.zip', mime: 'application/zip' },
  { name: 'script.js', mime: 'text/javascript' },
];

/** Todas las combinaciones de 3 intereses entre los 6 primeros (20 combinaciones). */
export const INTEREST_TRIPLES: number[][] = (() => {
  const r: number[][] = [];
  for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) for (let c = b + 1; c < 6; c++) r.push([a, b, c]);
  return r;
})();
