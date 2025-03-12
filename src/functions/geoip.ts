import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as maxmind from "maxmind";

import * as path from 'path';
const dbPath = path.resolve(process.cwd(), 'src', 'data', 'GeoLite2-City.mmdb');
if (!dbPath) {
  console.error("GeoIPデータベースファイルが見つかりません。");
}
let lookup: maxmind.Reader<maxmind.CityResponse>;

// アプリ起動時にデータベースを読み込む
maxmind.open<maxmind.CityResponse>(dbPath)
  .then(reader => {
    lookup = reader;
  })
  .catch(err => {
    console.error("GeoIPデータベースの読み込みに失敗しました:", err);
  });

export async function geoip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // クエリパラメータからIPアドレスを取得
  const ip = request.query.get("ip");
  if (!ip) {
    return { status: 400, body: "クエリパラメータ 'ip' を指定してください。" };
  }

  try {
    // IPアドレスから地理情報を取得
    const geoInfo = lookup.get(ip);
    if (!geoInfo) {
      return { status: 404, body: "指定されたIPアドレスの地理情報が見つかりません。" };
    }

    const country = geoInfo.country?.names?.ja || "不明";
    const city = geoInfo.city?.names?.ja || "不明";

    return {
      status: 200,
      jsonBody: { country, city }
    };
  } catch (err) {
    context.error(`IPアドレス ${ip} の検索中にエラーが発生しました:`, err);
    return { status: 500, body: "内部サーバーエラーが発生しました。" };
  }
};

// 関数をHTTPトリガーとして登録
app.http('geoip', {
  methods: ['GET'],
  authLevel: 'function',
  handler: geoip
});
