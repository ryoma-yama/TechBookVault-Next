import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";

export default async function BookListPage() {
  const allBooks = await db.select().from(books);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {allBooks.map((book) => {
        const coverUrl = `https://books.google.com/books/content?id=${book.googleId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;

        return (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle className="text-lg">{book.title}</CardTitle>
              <img src={coverUrl} alt={`${book.title} cover`} className="mt-2 rounded-md" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-1">{book.publisher}（{book.publishedDate}）</p>
              <p className="text-sm line-clamp-3">{book.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
