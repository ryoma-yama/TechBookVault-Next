/*
  書籍追加ページ：以下の機能を実装
  - ISBN入力
  - Google Books API による情報取得
  - 登録処理（未実装部分はサーバーアクションなどで後続対応）
  - Zod による型検証（any の排除）
*/

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";

const BookSchema = z.object({
  googleId: z.string().min(1),
  isbn13: z.string().length(13),
  title: z.string().min(1),
  publisher: z.string().min(1),
  publishedDate: z.string().min(1),
  description: z.string().min(1),
});

type BookFormData = z.infer<typeof BookSchema>;

export default function BookAddPage() {
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState<BookFormData | null>(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    setLoading(true);
    setError("");
    setBookData(null);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      const json = await res.json();
      const item = json.items?.[0];
      if (!item) throw new Error("該当する書籍が見つかりませんでした");
      const volume = item.volumeInfo;

      const data = BookSchema.parse({
        googleId: item.id,
        isbn13: isbn,
        title: volume.title || "",
        publisher: volume.publisher || "",
        publishedDate: volume.publishedDate || "",
        description: volume.description || "",
      });

      setBookData(data);
    } catch (e: any) {
      setError(e.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    // TODO: 書籍登録処理（APIルート or サーバーアクション）
    alert("登録処理は未実装です");
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>書籍追加</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="ISBN13 を入力"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading || !isbn}>
            {loading ? "検索中..." : "書籍検索"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {bookData && (
            <div className="space-y-2">
              <p><strong>タイトル:</strong> {bookData.title}</p>
              <p><strong>出版社:</strong> {bookData.publisher}</p>
              <p><strong>出版日:</strong> {bookData.publishedDate}</p>
              <p><strong>説明:</strong> {bookData.description.slice(0, 100)}...</p>
              <Button onClick={handleSubmit}>登録</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
