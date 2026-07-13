<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"
    import="java.io.*, java.nio.charset.StandardCharsets, java.security.MessageDigest, java.util.*, java.text.SimpleDateFormat" %>
<%!
    // 리뷰 한 건 = "타임스탬프이름비밀번호해시내용" 한 줄. WEB-INF 안에 저장되어 외부에서 직접 접근 불가.
    private static final String REVIEW_FILE_NAME = "reviews.dat";
    private static final String SEP = "";

    String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 필드 안의 구분자·줄바꿈이 파일 형식을 깨지 않도록 이스케이프
    String escapeField(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\n", "\\n").replace("\r", "").replace(SEP, "");
    }

    String unescapeField(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\' && i + 1 < s.length()) {
                char next = s.charAt(i + 1);
                if (next == 'n') { out.append('\n'); i++; continue; }
                if (next == '\\') { out.append('\\'); i++; continue; }
            }
            out.append(c);
        }
        return out.toString();
    }
%>
<%
    String reviewFilePath = application.getRealPath("/WEB-INF/" + REVIEW_FILE_NAME);
    String errorMsg = null;

    if ("POST".equalsIgnoreCase(request.getMethod())) {
        String name = request.getParameter("name");
        String pass = request.getParameter("pass");
        String review = request.getParameter("review");

        if (name == null || name.trim().isEmpty()) {
            name = "익명";
        } else {
            name = name.trim();
        }

        if (name.length() > 20) {
            errorMsg = "이름은 20자 이하로 작성해주세요.";
        } else if (pass == null || !pass.matches("\\d{4}")) {
            errorMsg = "패스워드는 4개의 숫자로 작성해주세요.";
        } else if (review == null || review.trim().isEmpty()) {
            errorMsg = "리뷰에 아무것도 쓰이지 않았습니다.";
        } else {
            review = review.trim();
            String passHash = sha256Hex(pass);
            long time = System.currentTimeMillis();
            String line = time + SEP + escapeField(name) + SEP + passHash + SEP + escapeField(review);

            synchronized (application) {
                try (Writer w = new OutputStreamWriter(new FileOutputStream(reviewFilePath, true), StandardCharsets.UTF_8)) {
                    w.write(line);
                    w.write("\n");
                }
            }

            response.sendRedirect("review.jsp");
            return;
        }
    }

    List<String[]> reviews = new ArrayList<>();
    File reviewFile = new File(reviewFilePath);
    if (reviewFile.exists()) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(reviewFile), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] parts = line.split(SEP, 4);
                if (parts.length == 4) {
                    reviews.add(parts);
                }
            }
        }
    }
    Collections.reverse(reviews); // 최신순으로 표시
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link type="text/css" rel="stylesheet" href="poketest.css">
    <link href="favicon.ico" rel="icon" type="image/x-icon" />
    <script src="review.js"></script>
    <title>Poketest 리뷰</title>
</head>
<body>
    <header class="simple">
        <h1>리뷰</h1>
    </header>

    <div class="wrap">
        <section class="card">
            <h2>리뷰 남기기</h2>
            <form class="review-form" method="post" onsubmit="return validateReview()">
                <fieldset>
                    <legend>리뷰 남기기</legend>
                    <span class="field-label">닉네임</span>
                    <input type="text" name="name" placeholder="익명" maxlength="20">
                    <span class="field-label">패스워드</span>
                    <input type="password" name="pass" placeholder="숫자 4자리" maxlength="4">
                    <span class="field-label">내용</span>
                    <textarea name="review" rows="3" cols="80"></textarea>
                    <div class="actions" style="text-align:left; margin-top:16px;">
                        <input type="submit" value="등록하기">
                    </div>
                    <p id="result"><%= errorMsg != null ? escapeHtml(errorMsg) : "" %></p>
                </fieldset>
            </form>
        </section>

        <section class="card">
            <h2>남겨진 리뷰 (<%= reviews.size() %>)</h2>
            <% if (reviews.isEmpty()) { %>
                <p>아직 리뷰가 없습니다. 첫 리뷰를 남겨주세요!</p>
            <% } else { %>
                <% for (String[] r : reviews) {
                    long time = Long.parseLong(r[0]);
                    String name = unescapeField(r[1]);
                    String reviewText = unescapeField(r[3]);
                    String dateStr = sdf.format(new Date(time));
                %>
                <div class="review-item">
                    <div class="review-meta"><strong><%= escapeHtml(name) %></strong> · <%= dateStr %></div>
                    <div class="review-body"><%= escapeHtml(reviewText) %></div>
                </div>
                <% } %>
            <% } %>
        </section>
    </div>

    <footer>
        <a href="poketest.html">처음으로</a>
    </footer>
</body>
</html>
