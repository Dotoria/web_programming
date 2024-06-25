function submit() {
    let result;

    let name = document.getElementsByName("name").value;
    let nameExp = /^\.{1, 20}$/;

    let pass = document.getElementsByName("pass").value;
    let passExp = /^\d{4}$/;

    let review = document.getElementsByName("review").value;
    let reviewExp = /.+/;

    if (!nameExp.test(name)) { result = "이름은 20자 이하로 작성해주세요."; }
    else if (!passExp.test(pass)) { result = "패스워드는 4개의 숫자로 작성해주세요."; }
    else if (!reviewExp.test(review)) { result = "리뷰에 아무것도 쓰이지 않았습니다."; } 
    else { result = ""; }

    document.getElementsByName("result").innerHTML = result;
}