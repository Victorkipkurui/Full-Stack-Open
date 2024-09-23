sequenceDiagram
    participant User
    participant Browser
    participant Server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    Server->>Browser: Respond with HTML Page (spa)
    Browser->>User: Render Page
    
