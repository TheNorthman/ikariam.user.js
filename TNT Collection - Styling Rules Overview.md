TNT Collection - Styling Rules Overview

| CATEGORY           | RESOURCES TABLE                                                                 | BUILDINGS TABLE                                         | COMMON RULES                                 |
|--------------------|--------------------------------------------------------------------------------|---------------------------------------------------------|----------------------------------------------|
| **Base Styles**        | 12px Arial, <span style="background:#fdf7dd">#fdf7dd</span> bg                  | Same                                                    | Collapsed borders, 4px padding               |
| **Headers**            | <span style="background:#faeac6">#faeac6</span> bg, bold, center                  | Same                                                    | Dynamic category spans                       |
| **Column Visibility**  | City+Lvl always visible, others toggleable                                  | Only shows buildings that exist                         | Based on user settings/data                  |
| **Value Warnings**     | storage_min: <span style="background:#FF000050">#FF000050</span> when < threshold | tnt_construction: <span style="background:#80404050">#80404050</span> for upgrading | Red/orange tints for alerts                  |
| **Storage Thresholds** | Wood/Wine: <100k<br>Marble/Crystal/Sulfur: <50k                             | N/A                                                     | storage_danger: >80% max                     |
| **Production Indicators** | Bold font for tradegood cities, tooltips show 24h production                  | Construction status in tooltips                         | Hover shows additional info                  |
| **Current City**       | 2px black border around entire row                                          | Same                                                    | No background change, just border            |
| **Categories**         | City Info (2-4 cols), Resources (0-5 cols)                                 | Gov, Storage, Trade, Reducers, Enhancers, Military, Culture, Special | Spans calculated dynamically         |
| **Special Features**   | Number formatting with .toLocaleString()                                   | Palace+Governor merged into single column               | Clickable city names for navigation          |
| **Control Elements**   | Minimize (top-left), Toggle (top-right)                                    | Same                                                    | Sprite-based icons with hover states         |
| **Total Row**          | Shows sums, <span style="background:#faeac6">#faeac6</span> bg, bold             | Empty cells, same header styling                        | Last row of each table                       |

**Key Differences:**
- **Resources:** Focus on quantities, warnings, production rates
- **Buildings:** Focus on construction status, building presence/absence  
- **Both:** Responsive visibility, current city highlighting, unified control scheme

**Color Codes:**
- <span style="background:#fdf7dd">#fdf7dd</span> = Light cream background
- <span style="background:#faeac6">#faeac6</span> = Header background (darker cream)
- <span style="background:#DBBE8C">#DBBE8C</span> = Category header background (brown/tan)
- <span style="background:#FF000050">#FF000050</span> = Red tint for storage warnings
- <span style="background:#80404050">#80404050</span> = Orange tint for construction