# VTO Auto-Mater (Refresher)

**VTO Auto-Mater** (nicknamed *Refresher*) is a lightweight Firefox extension that automates the Amazon AtoZ VTO process.  
It refreshes the page during drop windows, handles the "Stay logged in" prompt, and automatically clicks through the **Accept** and **Confirm** buttons.

---

## Features
- Refreshes Amazon AtoZ automatically during VTO drop windows  
- Detects and clicks the **Stay logged in** prompt  
- Finds and clicks the **Accept** button as soon as it appears  

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/anromerk/refresher.git
   ```
2. Open Firefox and go to:
   ```
   about:debugging#/runtime/this-firefox
   ```
3. Click **Load Temporary Add-on**  

4. Select the `manifest.json` file inside the `refresher/` folder  

---
