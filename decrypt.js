const _do_decrypt = function (encrypted, password) {
    let key = CryptoJS.enc.Utf8.parse(password);
    let iv = CryptoJS.enc.Utf8.parse(password.substr(16));

    let decrypted_data = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 解决问题:  Malformed UTF-8 data, 不知为何加上后, 无法正常解密
    // decrypted_data = decrypted_data.toString().replace('\n','');
    return decrypted_data.toString(CryptoJS.enc.Utf8);
};

const _click_handler = function (element) {
    let parent = element.parentNode.parentNode;
    let encrypted = parent.querySelector(
        ".hugo-encryptor-cipher-text").innerText;
    let password = parent.querySelector(
        ".hugo-encryptor-input").value;
    password = CryptoJS.MD5(password).toString();

    let index = -1;
    let elements = document.querySelectorAll(
        ".hugo-encryptor-container");
    for (index = 0; index < elements.length; ++index) {
        if (elements[index].isSameNode(parent)) {
            break;
        }
    }

    let decrypted = "";
    try {
        decrypted = _do_decrypt(encrypted, password);
    } catch (err) {
      // 解密失败, 原因是: Malformed UTF-8 data
        alert("密码错误!!");
        return;
    }

    if (!decrypted.includes("--- DON'T MODIFY THIS LINE ---")) {
        alert("密码错误");
        return;
    }

    let storage = localStorage;

    let key = location.pathname + ".password." + index;
    storage.setItem(key, password);
    parent.innerHTML = decrypted;
}

window.onload = () => {
    let index = -1;
    let elements = document.querySelectorAll(
        ".hugo-encryptor-container");

    while (1) {
        ++index;

        let key = location.pathname + ".password." + index;
        let password = localStorage.getItem(key);

        if (!password) {
            break;

        } else {
            console.log("Found password for part " + index);

            let parent = elements[index];
            let encrypted = parent.querySelector(".hugo-encryptor-cipher-text").innerText;
            let decrypted = _do_decrypt(encrypted, password);
            elements[index].innerHTML = decrypted;
        }
    }
};