sequenceDiagram
    participant User
    participant Browser
    participant Server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    Server->>Browser: Respond with HTML Page (notes)
    Browser->>User: Render Page
    User->>Browser: Fills in Form and saves it (You look great)
    Browser->>Server: Send Form Data POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Server->>Browser: Respond with New Page (HTML)
    Browser->>User: Render New Page
