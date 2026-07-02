# ER Diagram

```mermaid
eerDiagram
  USER ||--o{ BOOKING : makes
  ROOM ||--o{ BOOKING : includes
  USER ||--o{ REVIEW : writes
  ROOM ||--o{ REVIEW : receives
  USER ||--o{ ORDER : places
  MENU_ITEM ||--o{ ORDER_ITEM : appears_in
  ORDER ||--o{ ORDER_ITEM : contains
```
