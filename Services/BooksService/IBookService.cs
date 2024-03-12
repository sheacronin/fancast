using fancast.Models;

namespace fancast.Services.BooksService;

public interface IBooksService
{
  Task<Book> Get(string id);
  Task<Book[]> Search(string title);
}