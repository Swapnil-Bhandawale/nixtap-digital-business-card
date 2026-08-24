# Use the official .NET 8 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["PaymentService.csproj", "./"]
RUN dotnet restore "PaymentService.csproj"

# Copy the rest of the source code and build
COPY . .
RUN dotnet build "PaymentService.csproj" -c Release -o /app/build

# Publish the application
RUN dotnet publish "PaymentService.csproj" -c Release -o /app/publish

# Use the official .NET 8 ASP.NET runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PaymentService.dll"]
