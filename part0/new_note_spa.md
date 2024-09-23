sequenceDiagram
    participant User
    participant Browser
    participant Server 

    User->>Browser: Fills in Form and saves it (You look great)
    Browser->>Server: Send Form Data POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Server->>Browser: Respond with Json Page (new_note_spa)
    Browser->>User: Render Page