// Cloudflare Pages Function: /api/reviews
// review.jsp를 대체하는 API. 리뷰 전체를 KV 키 "reviews"에 JSON 배열(최신순)로 저장한다.

async function sha256Hex(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// SimpleDateFormat("yyyy-MM-dd HH:mm")와 동일한 형식을 KST(UTC+9) 기준으로 생성
function formatKst(epochMs) {
    const d = new Date(epochMs + 9 * 60 * 60 * 1000);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

function json(data, status) {
    return new Response(JSON.stringify(data), {
        status: status || 200,
        headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
}

export async function onRequestGet(context) {
    const reviews = (await context.env.REVIEWS_KV.get("reviews", "json")) || [];
    return json({
        count: reviews.length,
        reviews: reviews.map((r) => ({ name: r.name, review: r.review, date: r.date })),
    });
}

export async function onRequestPost(context) {
    let body;
    try {
        body = await context.request.json();
    } catch (e) {
        return json({ error: "잘못된 요청입니다." }, 400);
    }

    let name = body && body.name;
    const pass = body && body.pass;
    let review = body && body.review;

    if (!name || String(name).trim() === "") {
        name = "익명";
    } else {
        name = String(name).trim();
    }

    if (name.length > 20) {
        return json({ error: "이름은 20자 이하로 작성해주세요." }, 400);
    }
    if (typeof pass !== "string" || !/^\d{4}$/.test(pass)) {
        return json({ error: "패스워드는 4개의 숫자로 작성해주세요." }, 400);
    }
    if (!review || String(review).trim() === "") {
        return json({ error: "리뷰에 아무것도 쓰이지 않았습니다." }, 400);
    }
    review = String(review).trim();

    try {
        const passHash = await sha256Hex(pass);
        const time = Date.now();
        const date = formatKst(time);
        const entry = { name, review, time, date, passHash };

        const reviews = (await context.env.REVIEWS_KV.get("reviews", "json")) || [];
        reviews.unshift(entry);
        await context.env.REVIEWS_KV.put("reviews", JSON.stringify(reviews));

        return json({ ok: true, review: { name, review: entry.review, date } }, 201);
    } catch (e) {
        return json({ error: "서버 오류로 리뷰 등록에 실패했습니다. 잠시 후 다시 시도해주세요." }, 500);
    }
}
