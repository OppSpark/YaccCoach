// 이메일 검증
exports.isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// 비밀번호 검증 (8자 이상, 특수문자 포함)
exports.isValidPassword = (password) => password.length >= 8 && /[!@#$%^&*]/.test(password);

// 전화번호 검증 (010 시작, 11자리)
exports.isValidTel = (tel) => /^010\d{8}$/.test(tel);

// 주소 검증 (100자 이내)
exports.isValidAddress = (address) => address.length <= 100;

// 개인정보 동의 검증 (Y/N만 허용)
//exports.isValidAgreed = (agreed) => ["Y", "N"].includes(agreed);
exports.isValidAgreed = (agreed) => [1, 0].includes(agreed)


