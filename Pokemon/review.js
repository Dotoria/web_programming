function validateReview() {
    var name = document.getElementsByName("name")[0].value;
    var nameExp = /^.{0,20}$/;

    var pass = document.getElementsByName("pass")[0].value;
    var passExp = /^\d{4}$/;

    var review = document.getElementsByName("review")[0].value;

    var resultEl = document.getElementById("result");

    if (!nameExp.test(name)) {
        resultEl.innerText = "이름은 20자 이하로 작성해주세요.";
        return false;
    }
    if (!passExp.test(pass)) {
        resultEl.innerText = "패스워드는 4개의 숫자로 작성해주세요.";
        return false;
    }
    if (review.trim() === "") {
        resultEl.innerText = "리뷰에 아무것도 쓰이지 않았습니다.";
        return false;
    }

    resultEl.innerText = "";
    return true;
}
