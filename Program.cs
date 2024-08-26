var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.Use(async (context, next) =>
{
    context.Response.Redirect("https://fancast.fly.dev/" + context.Request.Path
        + context.Request.QueryString, permanent: true);
    await next(context);
});

app.Run();
